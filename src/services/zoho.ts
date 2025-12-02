import axios, { AxiosInstance } from 'axios';
import { 
  Deal, 
  DealStage, 
  ZohoConfig, 
  ZohoDeal, 
  ZohoDealsResponse, 
  ZohoTokenResponse,
  PipelineMetrics,
  StageMetrics
} from '@/types';

const ZOHO_ACCOUNTS_URL = 'https://accounts.zoho.com';
const STAGE_MAPPING: Record<string, DealStage> = {
  'Qualification': 'Lead',
  'Needs Analysis': 'Discovery',
  'Value Proposition': 'Qualified',
  'Identify Decision Makers': 'Qualified',
  'Proposal/Price Quote': 'Proposal',
  'Negotiation/Review': 'Negotiation',
  'Closed Won': 'Closed Won',
  'Closed Lost': 'Closed Lost',
  // Direct mappings
  'Lead': 'Lead',
  'Discovery': 'Discovery',
  'Qualified': 'Qualified',
  'Proposal': 'Proposal',
  'Negotiation': 'Negotiation',
};

const STAGE_PROBABILITIES: Record<DealStage, number> = {
  'Lead': 10,
  'Discovery': 20,
  'Qualified': 40,
  'Proposal': 60,
  'Negotiation': 80,
  'Closed Won': 100,
  'Closed Lost': 0,
};

class ZohoService {
  private config: ZohoConfig | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private api: AxiosInstance | null = null;

  initialize(config: ZohoConfig) {
    this.config = config;
    this.accessToken = config.accessToken || null;
    this.updateApiInstance();
  }

  private updateApiInstance() {
    if (!this.config) return;
    
    const baseURL = `https://www.zohoapis.${this.config.domain}/crm/v5`;
    
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(async (config) => {
      const token = await this.getAccessToken();
      config.headers.Authorization = `Zoho-oauthtoken ${token}`;
      return config;
    });
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.config) {
      throw new Error('Zoho service not initialized');
    }

    const response = await axios.post<ZohoTokenResponse>(
      `${ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
      null,
      {
        params: {
          grant_type: 'refresh_token',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken,
        },
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
    
    return this.accessToken;
  }

  private mapZohoDealToDeal(zohoDeal: ZohoDeal): Deal {
    const mappedStage = STAGE_MAPPING[zohoDeal.Stage] || 'Lead';
    
    return {
      id: zohoDeal.id,
      name: zohoDeal.Deal_Name,
      company: zohoDeal.Account_Name?.name || 'N/A',
      value: zohoDeal.Amount || 0,
      stage: mappedStage,
      probability: zohoDeal.Probability || STAGE_PROBABILITIES[mappedStage],
      expectedCloseDate: zohoDeal.Closing_Date,
      owner: zohoDeal.Owner?.name || 'Unassigned',
      createdAt: zohoDeal.Created_Time,
      updatedAt: zohoDeal.Modified_Time,
      contact: zohoDeal.Contact_Name ? {
        name: zohoDeal.Contact_Name.name,
        email: '',
      } : undefined,
      notes: zohoDeal.Description,
    };
  }

  async getDeals(): Promise<Deal[]> {
    if (!this.api) {
      throw new Error('Zoho service not initialized');
    }

    try {
      const response = await this.api.get<ZohoDealsResponse>('/Deals', {
        params: {
          fields: 'Deal_Name,Account_Name,Amount,Stage,Probability,Closing_Date,Owner,Created_Time,Modified_Time,Contact_Name,Description',
          per_page: 200,
        },
      });

      return response.data.data.map(this.mapZohoDealToDeal);
    } catch (error) {
      console.error('Error fetching deals from Zoho:', error);
      throw error;
    }
  }

  async createDeal(deal: Partial<Deal>): Promise<Deal> {
    if (!this.api) {
      throw new Error('Zoho service not initialized');
    }

    const zohoStage = Object.entries(STAGE_MAPPING).find(
      ([, value]) => value === deal.stage
    )?.[0] || deal.stage;

    const response = await this.api.post('/Deals', {
      data: [{
        Deal_Name: deal.name,
        Amount: deal.value,
        Stage: zohoStage,
        Closing_Date: deal.expectedCloseDate,
      }],
    });

    return this.mapZohoDealToDeal(response.data.data[0]);
  }

  async updateDeal(dealId: string, updates: Partial<Deal>): Promise<Deal> {
    if (!this.api) {
      throw new Error('Zoho service not initialized');
    }

    const updateData: Record<string, unknown> = {};
    
    if (updates.name) updateData.Deal_Name = updates.name;
    if (updates.value !== undefined) updateData.Amount = updates.value;
    if (updates.stage) {
      const zohoStage = Object.entries(STAGE_MAPPING).find(
        ([, value]) => value === updates.stage
      )?.[0] || updates.stage;
      updateData.Stage = zohoStage;
    }
    if (updates.expectedCloseDate) updateData.Closing_Date = updates.expectedCloseDate;

    const response = await this.api.put(`/Deals/${dealId}`, {
      data: [updateData],
    });

    return this.mapZohoDealToDeal(response.data.data[0]);
  }

  async updateDealStage(dealId: string, stage: DealStage): Promise<Deal> {
    return this.updateDeal(dealId, { stage });
  }

  calculateMetrics(deals: Deal[]): PipelineMetrics {
    const stages: DealStage[] = [
      'Lead', 'Discovery', 'Qualified', 'Proposal', 
      'Negotiation', 'Closed Won', 'Closed Lost'
    ];

    const activeStages: DealStage[] = [
      'Lead', 'Discovery', 'Qualified', 'Proposal', 'Negotiation'
    ];

    const activeDeals = deals.filter(d => activeStages.includes(d.stage));
    const closedWonDeals = deals.filter(d => d.stage === 'Closed Won');
    const totalClosedDeals = deals.filter(d => 
      d.stage === 'Closed Won' || d.stage === 'Closed Lost'
    );

    const pipelineTotal = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const weightedPipeline = activeDeals.reduce(
      (sum, d) => sum + (d.value * d.probability / 100), 0
    );
    const closedWonValue = closedWonDeals.reduce((sum, d) => sum + d.value, 0);

    const conversionRate = totalClosedDeals.length > 0
      ? (closedWonDeals.length / totalClosedDeals.length) * 100
      : 0;

    const stageDistribution: StageMetrics[] = stages.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage);
      const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
      
      // Calculate conversion rate: deals that moved to next stage / total deals in this stage
      const stageIndex = stages.indexOf(stage);
      const nextStages = stages.slice(stageIndex + 1);
      const dealsProgressed = deals.filter(d => 
        nextStages.includes(d.stage) || d.stage === 'Closed Won'
      ).length;
      
      const stageConversion = stageDeals.length > 0
        ? Math.round((dealsProgressed / (stageDeals.length + dealsProgressed)) * 100)
        : 0;

      return {
        stage,
        dealCount: stageDeals.length,
        totalValue: stageTotalValue,
        conversionRate: stage === 'Closed Won' || stage === 'Closed Lost' 
          ? 100 
          : stageConversion,
      };
    });

    return {
      totalDeals: deals.length,
      activeDeals: activeDeals.length,
      pipelineTotal,
      weightedPipeline,
      closedWonValue,
      closedWonCount: closedWonDeals.length,
      conversionRate,
      stageDistribution,
    };
  }

  isInitialized(): boolean {
    return this.config !== null;
  }
}

export const zohoService = new ZohoService();
export default zohoService;

