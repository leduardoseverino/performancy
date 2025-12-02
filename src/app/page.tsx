'use client';

import { useEffect } from 'react';
import { DollarSign, Target, TrendingUp, CheckCircle2, Percent } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import StageDistribution from '@/components/StageDistribution';
import KanbanBoard from '@/components/KanbanBoard';
import { useAppStore, DEMO_DEALS } from '@/store';
import zohoService from '@/services/zoho';

export default function FunilPage() {
  const { 
    deals, 
    setDeals, 
    metrics, 
    updateMetrics, 
    isZohoConnected,
    sidebarCollapsed,
    isLoading 
  } = useAppStore();

  useEffect(() => {
    // Initialize with demo data if no deals exist
    if (deals.length === 0) {
      setDeals(DEMO_DEALS);
    } else {
      updateMetrics();
    }
  }, []);

  // Calculate metrics for active deals (Discovery to Negotiation)
  const activeStages = ['Discovery', 'Qualified', 'Proposal', 'Negotiation'];
  const activeDeals = deals.filter(d => activeStages.includes(d.stage));

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          {/* Header */}
          <header className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">
                  Funil de Vendas
                </h1>
                <p className="text-surface-500">
                  Gerencie seus deals e acompanhe a performance do pipeline
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Zoho Connection Status */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                  isZohoConnected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-surface-100 text-surface-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isZohoConnected ? 'bg-green-500 animate-pulse-subtle' : 'bg-surface-400'
                  }`} />
                  {isZohoConnected ? 'Zoho Conectado' : 'Modo Demo'}
                </div>
              </div>
            </div>
          </header>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-surface-600 font-medium">Sincronizando com Zoho...</p>
              </div>
            </div>
          )}

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 stagger-children">
            <MetricCard
              title="Deals Ativos"
              value={activeDeals.length}
              subtitle="Em Discovery até Negotiation"
              icon={<Target size={18} />}
              delay={0}
            />
            <MetricCard
              title="Pipeline Total"
              value={metrics?.pipelineTotal || 0}
              subtitle="Valor total em aberto"
              icon={<DollarSign size={18} />}
              format="currency"
              delay={50}
            />
            <MetricCard
              title="Weighted Pipeline"
              value={metrics?.weightedPipeline || 0}
              subtitle="Baseado em win probability"
              icon={<TrendingUp size={18} />}
              format="currency"
              delay={100}
            />
            <MetricCard
              title="Deals Fechados"
              value={metrics?.closedWonCount || 0}
              subtitle={`R$ ${((metrics?.closedWonValue || 0) / 1000).toFixed(0)}.000 ganho`}
              icon={<CheckCircle2 size={18} />}
              delay={150}
            />
            <MetricCard
              title="Taxa Conversão"
              value={Math.round(metrics?.conversionRate || 0)}
              subtitle="Lead → Closed Won"
              icon={<Percent size={18} />}
              format="percentage"
              delay={200}
            />
          </div>

          {/* Stage Distribution */}
          <div className="mb-8">
            <StageDistribution stages={metrics?.stageDistribution || []} />
          </div>

          {/* Kanban Board */}
          <KanbanBoard deals={deals} />
        </div>
      </main>
    </div>
  );
}

