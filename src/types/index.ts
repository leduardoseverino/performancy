export type DealStage = 
  | 'Lead'
  | 'Discovery'
  | 'Qualified'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  contact?: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: string;
}

export interface StageMetrics {
  stage: DealStage;
  dealCount: number;
  totalValue: number;
  conversionRate: number;
}

export interface PipelineMetrics {
  totalDeals: number;
  activeDeals: number;
  pipelineTotal: number;
  weightedPipeline: number;
  closedWonValue: number;
  closedWonCount: number;
  conversionRate: number;
  stageDistribution: StageMetrics[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  team?: string;
}

export interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessToken?: string;
  domain: 'com' | 'eu' | 'in' | 'com.cn' | 'com.au' | 'jp';
}

export interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface ZohoDeal {
  id: string;
  Deal_Name: string;
  Account_Name?: { id: string; name: string };
  Amount: number;
  Stage: string;
  Probability: number;
  Closing_Date: string;
  Owner: { id: string; name: string };
  Created_Time: string;
  Modified_Time: string;
  Contact_Name?: { id: string; name: string };
  Description?: string;
}

export interface ZohoDealsResponse {
  data: ZohoDeal[];
  info: {
    per_page: number;
    count: number;
    page: number;
    more_records: boolean;
  };
}

