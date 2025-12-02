import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Deal, DealStage, PipelineMetrics, User, ZohoConfig } from '@/types';
import zohoService from '@/services/zoho';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Zoho Configuration
  zohoConfig: ZohoConfig | null;
  setZohoConfig: (config: ZohoConfig | null) => void;
  isZohoConnected: boolean;
  setZohoConnected: (connected: boolean) => void;

  // Deals
  deals: Deal[];
  setDeals: (deals: Deal[]) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  moveDealToStage: (dealId: string, stage: DealStage) => void;

  // Metrics
  metrics: PipelineMetrics | null;
  updateMetrics: () => void;

  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedDeal: Deal | null;
  setSelectedDeal: (deal: Deal | null) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Fetch data from Zoho
  fetchDeals: () => Promise<void>;
  syncWithZoho: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: {
        id: '1',
        name: 'Thais Cano',
        email: 'thais@skyone.com',
        role: 'Sales Manager',
        team: 'Skyone',
      },
      setUser: (user) => set({ user }),

      // Zoho Configuration
      zohoConfig: null,
      setZohoConfig: (config) => {
        set({ zohoConfig: config });
        if (config) {
          zohoService.initialize(config);
          set({ isZohoConnected: true });
        } else {
          set({ isZohoConnected: false });
        }
      },
      isZohoConnected: false,
      setZohoConnected: (connected) => set({ isZohoConnected: connected }),

      // Deals - Initialize with demo data
      deals: [],
      setDeals: (deals) => {
        set({ deals });
        get().updateMetrics();
      },
      addDeal: (deal) => {
        set((state) => ({ deals: [...state.deals, deal] }));
        get().updateMetrics();
      },
      updateDeal: (dealId, updates) => {
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === dealId ? { ...deal, ...updates } : deal
          ),
        }));
        get().updateMetrics();
      },
      moveDealToStage: async (dealId, stage) => {
        const state = get();
        
        // Update locally first for optimistic UI
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === dealId ? { ...deal, stage, updatedAt: new Date().toISOString() } : deal
          ),
        }));
        get().updateMetrics();

        // Sync with Zoho if connected
        if (state.isZohoConnected) {
          try {
            await zohoService.updateDealStage(dealId, stage);
          } catch (error) {
            console.error('Failed to sync with Zoho:', error);
            // Optionally revert on failure
          }
        }
      },

      // Metrics
      metrics: null,
      updateMetrics: () => {
        const { deals } = get();
        const metrics = zohoService.calculateMetrics(deals);
        set({ metrics });
      },

      // UI State
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      selectedDeal: null,
      setSelectedDeal: (deal) => set({ selectedDeal: deal }),

      // Loading states
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Fetch deals from Zoho
      fetchDeals: async () => {
        const state = get();
        if (!state.isZohoConnected) {
          console.log('Zoho not connected, using demo data');
          return;
        }

        set({ isLoading: true });
        try {
          const deals = await zohoService.getDeals();
          set({ deals });
          get().updateMetrics();
        } catch (error) {
          console.error('Failed to fetch deals:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      syncWithZoho: async () => {
        const state = get();
        if (!state.zohoConfig) return;

        zohoService.initialize(state.zohoConfig);
        await get().fetchDeals();
      },
    }),
    {
      name: 'performancy-storage',
      partialize: (state) => ({
        zohoConfig: state.zohoConfig,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Demo data for testing without Zoho connection
export const DEMO_DEALS: Deal[] = [
  {
    id: '1',
    name: 'Enterprise Software License',
    company: 'TechCorp Brasil',
    value: 150000,
    stage: 'Lead',
    probability: 10,
    expectedCloseDate: '2024-03-15',
    owner: 'Thais Rui Cano',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    contact: { name: 'Thais Cano', email: 'thais.cano@skyone.solutions' },
  },
  {
    id: '2',
    name: 'Cloud Migration Project',
    company: 'Banco Nacional',
    value: 115000,
    stage: 'Lead',
    probability: 10,
    expectedCloseDate: '2024-04-01',
    owner: 'Thais Rui Cano',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-11T16:00:00Z',
    contact: { name: 'Ana Costa', email: 'ana.costa@banconacional.com.br' },
  },
  {
    id: '3',
    name: 'Data Analytics Platform',
    company: 'Varejo Express',
    value: 280000,
    stage: 'Discovery',
    probability: 20,
    expectedCloseDate: '2024-02-28',
    owner: 'Thais Rui Cano',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
    contact: { name: 'Roberto Mendes', email: 'roberto@varejoexpress.com.br' },
  },
  {
    id: '4',
    name: 'Security Infrastructure',
    company: 'Seguros Vida',
    value: 190000,
    stage: 'Discovery',
    probability: 25,
    expectedCloseDate: '2024-03-20',
    owner: 'Thais Rui Cano',
    createdAt: '2024-01-03T08:30:00Z',
    updatedAt: '2024-01-13T12:00:00Z',
    contact: { name: 'Márcia Lima', email: 'marcia@segurosvida.com.br' },
  },
  {
    id: '5',
    name: 'ERP Implementation',
    company: 'Indústria Metal',
    value: 250000,
    stage: 'Qualified',
    probability: 40,
    expectedCloseDate: '2024-02-15',
    owner: 'Thais Rui Cano',
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2024-01-10T15:00:00Z',
    contact: { name: 'Paulo Santos', email: 'paulo@industriametal.com.br' },
  },
  {
    id: '6',
    name: 'Mobile App Development',
    company: 'StartupBR',
    value: 185000,
    stage: 'Qualified',
    probability: 45,
    expectedCloseDate: '2024-03-01',
    owner: 'Thais Rui Cano',
    createdAt: '2023-12-15T14:00:00Z',
    updatedAt: '2024-01-09T11:00:00Z',
    contact: { name: 'Fernanda Rocha', email: 'fernanda@startupbr.com' },
  },
  {
    id: '7',
    name: 'AI Integration Suite',
    company: 'HealthTech Solutions',
    value: 320000,
    stage: 'Proposal',
    probability: 60,
    expectedCloseDate: '2024-02-10',
    owner: 'Thais Rui Cano',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-01-08T17:00:00Z',
    contact: { name: 'Dr. Marina Alves', email: 'marina@healthtech.com.br' },
  },
  {
    id: '8',
    name: 'DevOps Pipeline Setup',
    company: 'FinanceApp',
    value: 255000,
    stage: 'Proposal',
    probability: 65,
    expectedCloseDate: '2024-02-20',
    owner: 'Thais Rui Cano',
    createdAt: '2023-11-25T10:30:00Z',
    updatedAt: '2024-01-07T14:00:00Z',
    contact: { name: 'Lucas Ferreira', email: 'lucas@financeapp.com.br' },
  },
  {
    id: '9',
    name: 'Hybrid Cloud Solution',
    company: 'Energia Verde',
    value: 380000,
    stage: 'Negotiation',
    probability: 80,
    expectedCloseDate: '2024-01-30',
    owner: 'Thais Rui Cano',
    createdAt: '2023-11-10T11:00:00Z',
    updatedAt: '2024-01-06T16:00:00Z',
    contact: { name: 'André Oliveira', email: 'andre@energiaverde.com.br' },
  },
  {
    id: '10',
    name: 'Customer 360 Platform',
    company: 'Telecom Brasil',
    value: 220000,
    stage: 'Closed Won',
    probability: 100,
    expectedCloseDate: '2024-01-05',
    owner: 'Thais Rui Cano',
    createdAt: '2023-10-15T09:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    contact: { name: 'Juliana Prado', email: 'juliana@telecombrasil.com.br' },
  },
  {
    id: '11',
    name: 'IoT Fleet Management',
    company: 'Logística Express',
    value: 155000,
    stage: 'Closed Won',
    probability: 100,
    expectedCloseDate: '2024-01-02',
    owner: 'Thais Rui Cano',
    createdAt: '2023-10-01T08:00:00Z',
    updatedAt: '2024-01-02T11:30:00Z',
    contact: { name: 'Ricardo Nunes', email: 'ricardo@logisticaexpress.com.br' },
  },
  {
    id: '12',
    name: 'Legacy System Migration',
    company: 'Governo Municipal',
    value: 95000,
    stage: 'Closed Lost',
    probability: 0,
    expectedCloseDate: '2023-12-20',
    owner: 'Thais Rui Cano',
    createdAt: '2023-09-15T10:00:00Z',
    updatedAt: '2023-12-20T15:00:00Z',
    contact: { name: 'Dr. Antonio Gomes', email: 'antonio@prefeitura.gov.br' },
  },
  {
    id: '13',
    name: 'Chatbot Implementation',
    company: 'E-commerce Plus',
    value: 75000,
    stage: 'Closed Lost',
    probability: 0,
    expectedCloseDate: '2023-12-15',
    owner: 'Thais Rui Cano',
    createdAt: '2023-09-01T14:00:00Z',
    updatedAt: '2023-12-15T09:00:00Z',
    contact: { name: 'Camila Torres', email: 'camila@ecommerceplus.com.br' },
  },
];

