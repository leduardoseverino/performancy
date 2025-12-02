'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  Search,
  Filter,
  Users,
  Target,
  Zap,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  MoreVertical,
  Star
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/store';

interface Playbook {
  id: string;
  name: string;
  description: string;
  steps: number;
  duration: string;
  category: 'prospecting' | 'qualification' | 'closing' | 'onboarding';
  usageCount: number;
  successRate: number;
  starred: boolean;
  lastUsed?: string;
}

interface PlaybookStep {
  id: string;
  type: 'email' | 'call' | 'message' | 'task' | 'wait';
  title: string;
  description: string;
  dayOffset: number;
}

const DEMO_PLAYBOOKS: Playbook[] = [
  {
    id: '1',
    name: 'Prospecção Outbound B2B',
    description: 'Sequência completa para abordagem de novos leads enterprise',
    steps: 8,
    duration: '14 dias',
    category: 'prospecting',
    usageCount: 156,
    successRate: 34,
    starred: true,
    lastUsed: 'Hoje',
  },
  {
    id: '2',
    name: 'Qualificação BANT',
    description: 'Framework para qualificar leads usando metodologia BANT',
    steps: 5,
    duration: '7 dias',
    category: 'qualification',
    usageCount: 89,
    successRate: 67,
    starred: true,
    lastUsed: 'Ontem',
  },
  {
    id: '3',
    name: 'Fechamento Enterprise',
    description: 'Processo de negociação e fechamento para contas grandes',
    steps: 12,
    duration: '30 dias',
    category: 'closing',
    usageCount: 45,
    successRate: 52,
    starred: false,
    lastUsed: '3 dias',
  },
  {
    id: '4',
    name: 'Re-engajamento de Leads Frios',
    description: 'Reativar leads que não responderam há mais de 30 dias',
    steps: 6,
    duration: '21 dias',
    category: 'prospecting',
    usageCount: 78,
    successRate: 18,
    starred: false,
  },
  {
    id: '5',
    name: 'Onboarding de Cliente',
    description: 'Processo de integração e primeiro sucesso do cliente',
    steps: 10,
    duration: '14 dias',
    category: 'onboarding',
    usageCount: 34,
    successRate: 89,
    starred: true,
  },
  {
    id: '6',
    name: 'Follow-up Pós Demo',
    description: 'Sequência de acompanhamento após demonstração do produto',
    steps: 4,
    duration: '7 dias',
    category: 'qualification',
    usageCount: 123,
    successRate: 45,
    starred: false,
    lastUsed: 'Hoje',
  },
];

const PLAYBOOK_STEPS: PlaybookStep[] = [
  { id: '1', type: 'email', title: 'Email de Introdução', description: 'Apresentar a empresa e proposta de valor', dayOffset: 0 },
  { id: '2', type: 'wait', title: 'Aguardar', description: 'Esperar resposta do lead', dayOffset: 2 },
  { id: '3', type: 'call', title: 'Ligação de Descoberta', description: 'Entender necessidades e dores', dayOffset: 3 },
  { id: '4', type: 'email', title: 'Email com Material', description: 'Enviar case studies relevantes', dayOffset: 4 },
  { id: '5', type: 'message', title: 'Mensagem WhatsApp', description: 'Follow-up informal', dayOffset: 7 },
  { id: '6', type: 'task', title: 'Agendar Demo', description: 'Propor demonstração do produto', dayOffset: 10 },
  { id: '7', type: 'email', title: 'Email de Confirmação', description: 'Confirmar data e enviar agenda', dayOffset: 12 },
  { id: '8', type: 'call', title: 'Call de Fechamento', description: 'Apresentar proposta final', dayOffset: 14 },
];

export default function PlaybooksPage() {
  const { sidebarCollapsed } = useAppStore();
  const [playbooks, setPlaybooks] = useState(DEMO_PLAYBOOKS);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredPlaybooks = playbooks.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: Playbook['category']) => {
    switch (category) {
      case 'prospecting': return 'bg-blue-100 text-blue-700';
      case 'qualification': return 'bg-green-100 text-green-700';
      case 'closing': return 'bg-primary-100 text-primary-700';
      case 'onboarding': return 'bg-purple-100 text-purple-700';
    }
  };

  const getCategoryLabel = (category: Playbook['category']) => {
    switch (category) {
      case 'prospecting': return 'Prospecção';
      case 'qualification': return 'Qualificação';
      case 'closing': return 'Fechamento';
      case 'onboarding': return 'Onboarding';
    }
  };

  const getStepIcon = (type: PlaybookStep['type']) => {
    switch (type) {
      case 'email': return <Mail size={16} />;
      case 'call': return <Phone size={16} />;
      case 'message': return <MessageSquare size={16} />;
      case 'task': return <Target size={16} />;
      case 'wait': return <Clock size={16} />;
    }
  };

  const getStepColor = (type: PlaybookStep['type']) => {
    switch (type) {
      case 'email': return 'bg-blue-500';
      case 'call': return 'bg-green-500';
      case 'message': return 'bg-emerald-500';
      case 'task': return 'bg-primary-500';
      case 'wait': return 'bg-surface-400';
    }
  };

  const toggleStar = (id: string) => {
    setPlaybooks(prev => 
      prev.map(p => p.id === id ? { ...p, starred: !p.starred } : p)
    );
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          {/* Header */}
          <header className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-surface-900">
                    Playbooks
                  </h1>
                  <p className="text-surface-500">
                    Processos e sequências de vendas padronizados
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                <Plus size={18} />
                Novo Playbook
              </button>
            </div>
          </header>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Buscar playbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'prospecting', 'qualification', 'closing', 'onboarding'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : getCategoryLabel(cat as Playbook['category'])}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Playbooks List */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPlaybooks.map((playbook, index) => (
                  <div
                    key={playbook.id}
                    onClick={() => setSelectedPlaybook(playbook)}
                    className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-lg animate-slide-in ${
                      selectedPlaybook?.id === playbook.id 
                        ? 'border-primary-500 ring-2 ring-primary-100' 
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(playbook.category)}`}>
                        {getCategoryLabel(playbook.category)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(playbook.id);
                        }}
                        className={playbook.starred ? 'text-yellow-500' : 'text-surface-300 hover:text-surface-500'}
                      >
                        <Star size={18} fill={playbook.starred ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <h3 className="font-semibold text-surface-900 mb-2">{playbook.name}</h3>
                    <p className="text-sm text-surface-500 mb-4 line-clamp-2">{playbook.description}</p>

                    <div className="flex items-center gap-4 text-sm text-surface-600">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>{playbook.steps} etapas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{playbook.duration}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-surface-500">Taxa de sucesso: </span>
                        <span className={`font-semibold ${
                          playbook.successRate >= 50 ? 'text-green-600' : 
                          playbook.successRate >= 30 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {playbook.successRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-surface-400">
                        <Users size={14} />
                        <span className="text-sm">{playbook.usageCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Playbook Detail */}
            <div className="lg:col-span-1">
              {selectedPlaybook ? (
                <div className="bg-white rounded-2xl border border-surface-200 sticky top-8">
                  <div className="p-6 border-b border-surface-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(selectedPlaybook.category)}`}>
                        {getCategoryLabel(selectedPlaybook.category)}
                      </span>
                      <button className="p-2 rounded-lg hover:bg-surface-100 text-surface-500">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 mb-2">
                      {selectedPlaybook.name}
                    </h2>
                    <p className="text-sm text-surface-500">{selectedPlaybook.description}</p>
                    
                    <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                      <Play size={18} />
                      Iniciar Playbook
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="font-medium text-surface-900 mb-4">Etapas do Playbook</h3>
                    <div className="space-y-3">
                      {PLAYBOOK_STEPS.map((step, index) => (
                        <div key={step.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full ${getStepColor(step.type)} flex items-center justify-center text-white`}>
                              {getStepIcon(step.type)}
                            </div>
                            {index < PLAYBOOK_STEPS.length - 1 && (
                              <div className="w-0.5 h-8 bg-surface-200 my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-surface-900">{step.title}</h4>
                              <span className="text-xs text-surface-400">Dia {step.dayOffset}</span>
                            </div>
                            <p className="text-xs text-surface-500">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={28} className="text-surface-400" />
                  </div>
                  <h3 className="font-semibold text-surface-700 mb-2">Selecione um Playbook</h3>
                  <p className="text-sm text-surface-500">
                    Clique em um playbook para ver os detalhes e etapas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

