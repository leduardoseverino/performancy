'use client';

import { useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import { useAppStore, DEMO_DEALS } from '@/store';
import { useAuthStore } from '@/store/auth';

// Demo data for charts
const revenueData = [
  { month: 'Jan', value: 185000, deals: 3 },
  { month: 'Fev', value: 220000, deals: 4 },
  { month: 'Mar', value: 175000, deals: 2 },
  { month: 'Abr', value: 310000, deals: 5 },
  { month: 'Mai', value: 285000, deals: 4 },
  { month: 'Jun', value: 340000, deals: 6 },
  { month: 'Jul', value: 295000, deals: 5 },
  { month: 'Ago', value: 380000, deals: 7 },
  { month: 'Set', value: 420000, deals: 6 },
  { month: 'Out', value: 375000, deals: 5 },
  { month: 'Nov', value: 450000, deals: 8 },
  { month: 'Dez', value: 520000, deals: 9 },
];

const stageData = [
  { name: 'Lead', value: 265000, color: '#78716c' },
  { name: 'Discovery', value: 470000, color: '#3b82f6' },
  { name: 'Qualified', value: 435000, color: '#22c55e' },
  { name: 'Proposal', value: 575000, color: '#f97316' },
  { name: 'Negotiation', value: 380000, color: '#a855f7' },
];

const weeklyActivity = [
  { day: 'Seg', calls: 12, emails: 25, meetings: 3 },
  { day: 'Ter', calls: 15, emails: 30, meetings: 5 },
  { day: 'Qua', calls: 8, emails: 22, meetings: 2 },
  { day: 'Qui', calls: 18, emails: 35, meetings: 6 },
  { day: 'Sex', calls: 14, emails: 28, meetings: 4 },
];

const conversionData = [
  { stage: 'Lead → Discovery', rate: 67 },
  { stage: 'Discovery → Qualified', rate: 54 },
  { stage: 'Qualified → Proposal', rate: 72 },
  { stage: 'Proposal → Negotiation', rate: 45 },
  { stage: 'Negotiation → Won', rate: 38 },
];

export default function DashboardPage() {
  const { sidebarCollapsed, deals, setDeals, metrics, updateMetrics } = useAppStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (deals.length === 0) {
      setDeals(DEMO_DEALS);
    } else {
      updateMetrics();
    }
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon,
    color 
  }: { 
    title: string;
    value: string;
    change: string;
    changeType: 'up' | 'down';
    icon: any;
    color: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 border border-surface-200 card-interactive">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          changeType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <p className="text-3xl font-display font-bold text-surface-900 mb-1">{value}</p>
      <p className="text-sm text-surface-500">{title}</p>
    </div>
  );

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
                  Dashboard
                </h1>
                <p className="text-surface-500">
                  Bem-vindo de volta, {user?.given_name || 'usuário'}! Aqui está seu resumo.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-surface-200">
                <Calendar size={18} className="text-surface-500" />
                <span className="text-sm font-medium text-surface-700">Últimos 30 dias</span>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
            <StatCard
              title="Receita Total"
              value="R$ 2.125.000"
              change="+12.5%"
              changeType="up"
              icon={DollarSign}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              title="Deals Ativos"
              value="24"
              change="+8.3%"
              changeType="up"
              icon={Target}
              color="bg-gradient-to-br from-primary-500 to-primary-600"
            />
            <StatCard
              title="Taxa de Conversão"
              value="18%"
              change="-2.1%"
              changeType="down"
              icon={TrendingUp}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title="Novos Leads"
              value="47"
              change="+23.8%"
              changeType="up"
              icon={Users}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-surface-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">Receita Mensal</h3>
                  <p className="text-sm text-surface-500">Evolução ao longo do ano</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span className="text-sm text-surface-600">Receita</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="month" stroke="#a8a29e" fontSize={12} />
                  <YAxis stroke="#a8a29e" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e7e5e4',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pipeline Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-surface-200">
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Pipeline por Stage</h3>
              <p className="text-sm text-surface-500 mb-6">Distribuição do valor total</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e7e5e4'
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {stageData.map((stage) => (
                  <div key={stage.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="text-xs text-surface-600">{stage.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity */}
            <div className="bg-white rounded-2xl p-6 border border-surface-200">
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Atividade Semanal</h3>
              <p className="text-sm text-surface-500 mb-6">Ligações, emails e reuniões</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="day" stroke="#a8a29e" fontSize={12} />
                  <YAxis stroke="#a8a29e" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e7e5e4'
                    }}
                  />
                  <Bar dataKey="calls" fill="#f97316" radius={[4, 4, 0, 0]} name="Ligações" />
                  <Bar dataKey="emails" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Emails" />
                  <Bar dataKey="meetings" fill="#22c55e" radius={[4, 4, 0, 0]} name="Reuniões" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-2xl p-6 border border-surface-200">
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Funil de Conversão</h3>
              <p className="text-sm text-surface-500 mb-6">Taxa de conversão por etapa</p>
              <div className="space-y-4">
                {conversionData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-surface-700">{item.stage}</span>
                      <span className="text-sm font-semibold text-surface-900">{item.rate}%</span>
                    </div>
                    <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

