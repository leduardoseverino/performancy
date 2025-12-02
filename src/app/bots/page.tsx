'use client';

import { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  Copy
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/store';

interface BotConfig {
  id: string;
  name: string;
  description: string;
  type: 'qualification' | 'support' | 'scheduling' | 'followup';
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  stats: {
    conversations: number;
    qualified: number;
    conversion: number;
  };
  lastActivity?: string;
}

const DEMO_BOTS: BotConfig[] = [
  {
    id: '1',
    name: 'Qualificador de Leads',
    description: 'Qualifica leads automaticamente usando perguntas BANT',
    type: 'qualification',
    status: 'active',
    triggers: ['Novo lead', 'Form preenchido'],
    stats: { conversations: 234, qualified: 156, conversion: 67 },
    lastActivity: '5 min atrás',
  },
  {
    id: '2',
    name: 'Agendador de Demos',
    description: 'Agenda demonstrações automaticamente com leads qualificados',
    type: 'scheduling',
    status: 'active',
    triggers: ['Lead qualificado', 'Solicitação de demo'],
    stats: { conversations: 89, qualified: 67, conversion: 75 },
    lastActivity: '12 min atrás',
  },
  {
    id: '3',
    name: 'Follow-up Automático',
    description: 'Envia mensagens de follow-up para leads sem resposta',
    type: 'followup',
    status: 'paused',
    triggers: ['Sem resposta 3 dias', 'Email não aberto'],
    stats: { conversations: 156, qualified: 45, conversion: 29 },
    lastActivity: '2 dias atrás',
  },
  {
    id: '4',
    name: 'Suporte ao Cliente',
    description: 'Responde dúvidas frequentes e direciona para equipe',
    type: 'support',
    status: 'active',
    triggers: ['Chat iniciado', 'Dúvida identificada'],
    stats: { conversations: 512, qualified: 423, conversion: 83 },
    lastActivity: '1 min atrás',
  },
  {
    id: '5',
    name: 'Bot de Reativação',
    description: 'Reativa leads inativos com ofertas personalizadas',
    type: 'followup',
    status: 'draft',
    triggers: ['Lead inativo 30 dias'],
    stats: { conversations: 0, qualified: 0, conversion: 0 },
  },
];

const CONVERSATION_PREVIEW = [
  { role: 'bot', message: 'Olá! 👋 Sou o assistente da Performancy. Como posso ajudar?' },
  { role: 'user', message: 'Quero saber mais sobre o produto' },
  { role: 'bot', message: 'Ótimo! Para oferecer a melhor solução, posso fazer algumas perguntas?' },
  { role: 'user', message: 'Claro!' },
  { role: 'bot', message: 'Qual é o tamanho da sua equipe de vendas?' },
  { role: 'user', message: '15 vendedores' },
  { role: 'bot', message: 'Perfeito! E qual CRM vocês utilizam atualmente?' },
];

export default function BotsPage() {
  const { sidebarCollapsed } = useAppStore();
  const [bots, setBots] = useState(DEMO_BOTS);
  const [selectedBot, setSelectedBot] = useState<BotConfig | null>(null);

  const toggleBotStatus = (id: string) => {
    setBots(prev => prev.map(bot => {
      if (bot.id === id) {
        return {
          ...bot,
          status: bot.status === 'active' ? 'paused' : 'active'
        };
      }
      return bot;
    }));
  };

  const getTypeIcon = (type: BotConfig['type']) => {
    switch (type) {
      case 'qualification': return <Zap size={16} />;
      case 'support': return <MessageSquare size={16} />;
      case 'scheduling': return <Clock size={16} />;
      case 'followup': return <CheckCircle2 size={16} />;
    }
  };

  const getTypeLabel = (type: BotConfig['type']) => {
    switch (type) {
      case 'qualification': return 'Qualificação';
      case 'support': return 'Suporte';
      case 'scheduling': return 'Agendamento';
      case 'followup': return 'Follow-up';
    }
  };

  const getTypeColor = (type: BotConfig['type']) => {
    switch (type) {
      case 'qualification': return 'bg-primary-100 text-primary-700';
      case 'support': return 'bg-blue-100 text-blue-700';
      case 'scheduling': return 'bg-green-100 text-green-700';
      case 'followup': return 'bg-purple-100 text-purple-700';
    }
  };

  const getStatusColor = (status: BotConfig['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-amber-500';
      case 'draft': return 'bg-surface-400';
    }
  };

  const getStatusLabel = (status: BotConfig['status']) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'paused': return 'Pausado';
      case 'draft': return 'Rascunho';
    }
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-surface-900">
                    Bots
                  </h1>
                  <p className="text-surface-500">
                    Automatize conversas e qualificação de leads
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                <Plus size={18} />
                Criar Bot
              </button>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 stagger-children">
            <div className="bg-white rounded-2xl p-5 border border-surface-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Bot size={20} className="text-green-600" />
                </div>
                <span className="text-sm text-surface-500">Bots Ativos</span>
              </div>
              <p className="text-3xl font-display font-bold text-surface-900">
                {bots.filter(b => b.status === 'active').length}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-surface-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <MessageSquare size={20} className="text-blue-600" />
                </div>
                <span className="text-sm text-surface-500">Conversas Hoje</span>
              </div>
              <p className="text-3xl font-display font-bold text-surface-900">147</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-surface-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Zap size={20} className="text-primary-600" />
                </div>
                <span className="text-sm text-surface-500">Leads Qualificados</span>
              </div>
              <p className="text-3xl font-display font-bold text-surface-900">34</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-surface-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <BarChart3 size={20} className="text-purple-600" />
                </div>
                <span className="text-sm text-surface-500">Taxa de Conversão</span>
              </div>
              <p className="text-3xl font-display font-bold text-surface-900">68%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bots List */}
            <div className="lg:col-span-2 space-y-4">
              {bots.map((bot, index) => (
                <div
                  key={bot.id}
                  onClick={() => setSelectedBot(bot)}
                  className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-lg animate-slide-in ${
                    selectedBot?.id === bot.id 
                      ? 'border-primary-500 ring-2 ring-primary-100' 
                      : 'border-surface-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Bot Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={24} className="text-white" />
                    </div>

                    {/* Bot Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-surface-900">{bot.name}</h3>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)}`} />
                        <span className="text-xs text-surface-500">{getStatusLabel(bot.status)}</span>
                      </div>
                      <p className="text-sm text-surface-500 mb-3">{bot.description}</p>
                      
                      {/* Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getTypeColor(bot.type)}`}>
                          {getTypeIcon(bot.type)}
                          {getTypeLabel(bot.type)}
                        </span>
                        {bot.triggers.map((trigger, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-surface-100 text-surface-600">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-surface-900">{bot.stats.conversion}%</div>
                      <p className="text-xs text-surface-500">conversão</p>
                      {bot.lastActivity && (
                        <p className="text-xs text-surface-400 mt-2">{bot.lastActivity}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBotStatus(bot.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          bot.status === 'active'
                            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {bot.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="mt-4 pt-4 border-t border-surface-100 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-surface-500">Conversas</p>
                      <p className="text-lg font-semibold text-surface-900">{bot.stats.conversations}</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-500">Qualificados</p>
                      <p className="text-lg font-semibold text-surface-900">{bot.stats.qualified}</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-500">Conversão</p>
                      <p className="text-lg font-semibold text-green-600">{bot.stats.conversion}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              {selectedBot ? (
                <div className="bg-white rounded-2xl border border-surface-200 sticky top-8 overflow-hidden">
                  {/* Preview Header */}
                  <div className="p-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bot size={20} />
                        <span className="font-medium">{selectedBot.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30">
                          <Copy size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-red-200">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-cyan-100">Preview da conversa</p>
                  </div>

                  {/* Chat Preview */}
                  <div className="p-4 h-80 overflow-y-auto bg-surface-50">
                    <div className="space-y-3">
                      {CONVERSATION_PREVIEW.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-primary-500 text-white rounded-br-md'
                              : 'bg-white border border-surface-200 rounded-bl-md'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-surface-200">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                      <Settings size={18} />
                      Configurar Bot
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center sticky top-8">
                  <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                    <Bot size={28} className="text-surface-400" />
                  </div>
                  <h3 className="font-semibold text-surface-700 mb-2">Selecione um Bot</h3>
                  <p className="text-sm text-surface-500">
                    Clique em um bot para ver o preview da conversa
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

