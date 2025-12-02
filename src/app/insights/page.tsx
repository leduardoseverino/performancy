'use client';

import { useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  ArrowRight,
  Calendar,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAppStore, DEMO_DEALS } from '@/store';

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'action' | 'info';
  title: string;
  description: string;
  metric?: string;
  actionText?: string;
  priority: 'high' | 'medium' | 'low';
}

const DEMO_INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'positive',
    title: 'Pipeline em crescimento',
    description: 'Seu pipeline cresceu 23% comparado ao mês anterior. Continue com as atividades de prospecção.',
    metric: '+23%',
    priority: 'medium',
  },
  {
    id: '2',
    type: 'warning',
    title: '2 deals em risco de perda',
    description: 'Os deals "ERP Implementation" e "Mobile App" estão há mais de 14 dias sem atualização.',
    actionText: 'Ver deals',
    priority: 'high',
  },
  {
    id: '3',
    type: 'action',
    title: 'Oportunidade de upsell identificada',
    description: 'O cliente TechCorp Brasil pode se beneficiar do módulo adicional de Analytics.',
    actionText: 'Criar proposta',
    priority: 'high',
  },
  {
    id: '4',
    type: 'positive',
    title: 'Taxa de conversão acima da média',
    description: 'Sua conversão Lead → Discovery está 12% acima da média do time.',
    metric: '+12%',
    priority: 'low',
  },
  {
    id: '5',
    type: 'warning',
    title: 'Ciclo de vendas alongado',
    description: '3 deals estão em Proposal há mais de 30 dias. Considere revisar as objeções.',
    actionText: 'Analisar deals',
    priority: 'medium',
  },
  {
    id: '6',
    type: 'info',
    title: 'Melhor dia para follow-up',
    description: 'Baseado em dados históricos, terça-feira às 10h tem 40% mais respostas.',
    priority: 'low',
  },
];

const WEEKLY_GOALS = [
  { name: 'Novos leads qualificados', current: 8, target: 10, unit: 'leads' },
  { name: 'Calls de descoberta', current: 5, target: 8, unit: 'calls' },
  { name: 'Propostas enviadas', current: 3, target: 4, unit: 'propostas' },
  { name: 'Valor em negociação', current: 380, target: 500, unit: 'k' },
];

export default function InsightsPage() {
  const { sidebarCollapsed, deals, setDeals, metrics, updateMetrics } = useAppStore();

  useEffect(() => {
    if (deals.length === 0) {
      setDeals(DEMO_DEALS);
    } else {
      updateMetrics();
    }
  }, []);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'positive': return <CheckCircle2 size={20} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'action': return <Zap size={20} className="text-primary-500" />;
      case 'info': return <BarChart3 size={20} className="text-blue-500" />;
    }
  };

  const getInsightBg = (type: Insight['type']) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-100';
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'action': return 'bg-primary-50 border-primary-100';
      case 'info': return 'bg-blue-50 border-blue-100';
    }
  };

  const getPriorityBadge = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-surface-100 text-surface-600';
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          {/* Header */}
          <header className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-surface-900">
                Insights
              </h1>
            </div>
            <p className="text-surface-500">
              Recomendações inteligentes baseadas nos seus dados de vendas
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Insights */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-surface-200">
                  <div className="flex items-center gap-2 text-surface-500 mb-2">
                    <DollarSign size={16} />
                    <span className="text-sm">Pipeline</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-surface-900">
                    R$ {((metrics?.pipelineTotal || 0) / 1000000).toFixed(1)}M
                  </p>
                  <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                    <TrendingUp size={14} />
                    <span>+15%</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-surface-200">
                  <div className="flex items-center gap-2 text-surface-500 mb-2">
                    <Target size={16} />
                    <span className="text-sm">Conversão</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-surface-900">
                    {Math.round(metrics?.conversionRate || 0)}%
                  </p>
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <TrendingDown size={14} />
                    <span>-2%</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-surface-200">
                  <div className="flex items-center gap-2 text-surface-500 mb-2">
                    <Users size={16} />
                    <span className="text-sm">Deals Ativos</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-surface-900">
                    {metrics?.activeDeals || 0}
                  </p>
                  <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                    <TrendingUp size={14} />
                    <span>+3</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-surface-200">
                  <div className="flex items-center gap-2 text-surface-500 mb-2">
                    <Clock size={16} />
                    <span className="text-sm">Ciclo Médio</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-surface-900">
                    32 dias
                  </p>
                  <div className="flex items-center gap-1 text-surface-500 text-sm mt-1">
                    <span>Sem alteração</span>
                  </div>
                </div>
              </div>

              {/* Insights List */}
              <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
                <div className="p-6 border-b border-surface-200">
                  <h2 className="text-lg font-semibold text-surface-900">Recomendações para você</h2>
                  <p className="text-sm text-surface-500">Baseado na análise dos últimos 30 dias</p>
                </div>
                
                <div className="divide-y divide-surface-100">
                  {DEMO_INSIGHTS.map((insight, index) => (
                    <div 
                      key={insight.id}
                      className={`p-4 ${getInsightBg(insight.type)} border-l-4 animate-slide-in`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-surface-900">{insight.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(insight.priority)}`}>
                              {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                          </div>
                          <p className="text-sm text-surface-600 mb-2">{insight.description}</p>
                          {insight.actionText && (
                            <button className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                              {insight.actionText}
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                        {insight.metric && (
                          <div className="text-right">
                            <span className={`text-lg font-bold ${
                              insight.metric.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {insight.metric}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Goals & Calendar */}
            <div className="space-y-6">
              {/* Weekly Goals */}
              <div className="bg-white rounded-2xl p-6 border border-surface-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-surface-900">Metas Semanais</h2>
                  <div className="flex items-center gap-1 text-xs text-surface-500">
                    <Calendar size={12} />
                    <span>Semana 48</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {WEEKLY_GOALS.map((goal, index) => {
                    const percentage = Math.min((goal.current / goal.target) * 100, 100);
                    const isComplete = goal.current >= goal.target;
                    
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-surface-700">{goal.name}</span>
                          <span className={`text-sm font-medium ${isComplete ? 'text-green-600' : 'text-surface-900'}`}>
                            {goal.current}/{goal.target} {goal.unit}
                          </span>
                        </div>
                        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isComplete ? 'bg-green-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-surface-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-primary-500" />
                    <span className="text-sm font-medium text-surface-900">Score da Semana</span>
                  </div>
                  <p className="text-3xl font-display font-bold text-primary-600">72%</p>
                  <p className="text-xs text-surface-500 mt-1">Bom progresso! Continue assim.</p>
                </div>
              </div>

              {/* Activity Calendar */}
              <div className="bg-white rounded-2xl p-6 border border-surface-200">
                <h2 className="text-lg font-semibold text-surface-900 mb-4">Próximas Atividades</h2>
                
                <div className="space-y-3">
                  {[
                    { time: '10:00', title: 'Call com TechCorp', type: 'call' },
                    { time: '14:00', title: 'Demo para Banco Nacional', type: 'meeting' },
                    { time: '16:30', title: 'Follow-up Varejo Express', type: 'task' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
                      <div className="text-sm font-medium text-surface-500 w-12">{activity.time}</div>
                      <div className={`w-1 h-8 rounded-full ${
                        activity.type === 'call' ? 'bg-green-500' :
                        activity.type === 'meeting' ? 'bg-blue-500' : 'bg-primary-500'
                      }`} />
                      <span className="text-sm text-surface-700">{activity.title}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
                  Ver calendário completo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

