'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  MessageSquare,
  Clock,
  CheckCheck,
  Star,
  StarOff,
  Archive,
  Trash2,
  ChevronRight
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/store';

interface Conversation {
  id: string;
  contact: {
    name: string;
    company: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
  starred: boolean;
  channel: 'email' | 'phone' | 'whatsapp';
  status: 'active' | 'archived';
}

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    contact: { name: 'Thais Cano', company: 'Skyone Solutions', avatar: 'TC' },
    lastMessage: 'Olá! Gostaria de agendar uma demonstração do produto para a próxima semana.',
    timestamp: '10:32',
    unread: 2,
    starred: true,
    channel: 'whatsapp',
    status: 'active',
  },
  {
    id: '2',
    contact: { name: 'Ana Costa', company: 'Banco Nacional', avatar: 'AC' },
    lastMessage: 'Segue em anexo a proposta comercial conforme solicitado.',
    timestamp: '09:15',
    unread: 0,
    starred: false,
    channel: 'email',
    status: 'active',
  },
  {
    id: '3',
    contact: { name: 'Roberto Mendes', company: 'Varejo Express', avatar: 'RM' },
    lastMessage: 'Perfeito! Vamos fechar o contrato então. Pode enviar os documentos.',
    timestamp: 'Ontem',
    unread: 0,
    starred: true,
    channel: 'whatsapp',
    status: 'active',
  },
  {
    id: '4',
    contact: { name: 'Márcia Lima', company: 'Seguros Vida', avatar: 'ML' },
    lastMessage: 'Precisamos revisar alguns pontos da proposta antes de aprovar.',
    timestamp: 'Ontem',
    unread: 1,
    starred: false,
    channel: 'email',
    status: 'active',
  },
  {
    id: '5',
    contact: { name: 'Paulo Santos', company: 'Indústria Metal', avatar: 'PS' },
    lastMessage: 'Ligação perdida (3 min)',
    timestamp: 'Seg',
    unread: 0,
    starred: false,
    channel: 'phone',
    status: 'active',
  },
  {
    id: '6',
    contact: { name: 'Fernanda Rocha', company: 'StartupBR', avatar: 'FR' },
    lastMessage: 'Obrigada pelo atendimento! Vou analisar com a equipe.',
    timestamp: 'Seg',
    unread: 0,
    starred: false,
    channel: 'whatsapp',
    status: 'active',
  },
];

export default function ConversasPage() {
  const { sidebarCollapsed } = useAppStore();
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && conv.unread > 0) ||
                         (filter === 'starred' && conv.starred);
    return matchesSearch && matchesFilter;
  });

  const toggleStar = (id: string) => {
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, starred: !c.starred } : c)
    );
  };

  const getChannelIcon = (channel: Conversation['channel']) => {
    switch (channel) {
      case 'email': return <Mail size={14} />;
      case 'phone': return <Phone size={14} />;
      case 'whatsapp': return <MessageSquare size={14} />;
    }
  };

  const getChannelColor = (channel: Conversation['channel']) => {
    switch (channel) {
      case 'email': return 'text-blue-500 bg-blue-50';
      case 'phone': return 'text-green-500 bg-green-50';
      case 'whatsapp': return 'text-emerald-500 bg-emerald-50';
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex h-screen">
          {/* Conversations List */}
          <div className="w-96 bg-white border-r border-surface-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-surface-200">
              <h1 className="text-2xl font-display font-bold text-surface-900 mb-4">
                Conversas
              </h1>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                {(['all', 'unread', 'starred'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {f === 'all' ? 'Todas' : f === 'unread' ? 'Não lidas' : 'Favoritas'}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 border-b border-surface-100 cursor-pointer transition-colors hover:bg-surface-50 ${
                    selectedConversation?.id === conv.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {conv.contact.avatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium truncate ${conv.unread > 0 ? 'text-surface-900' : 'text-surface-700'}`}>
                          {conv.contact.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-surface-400">{conv.timestamp}</span>
                          {conv.unread > 0 && (
                            <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-surface-500 mb-1">{conv.contact.company}</p>
                      <p className={`text-sm truncate ${conv.unread > 0 ? 'text-surface-800 font-medium' : 'text-surface-500'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pl-15">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${getChannelColor(conv.channel)}`}>
                      {getChannelIcon(conv.channel)}
                      <span className="capitalize">{conv.channel}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(conv.id);
                      }}
                      className={`p-1 rounded ${conv.starred ? 'text-yellow-500' : 'text-surface-300 hover:text-surface-500'}`}
                    >
                      {conv.starred ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Detail */}
          <div className="flex-1 flex flex-col bg-surface-50">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-surface-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {selectedConversation.contact.avatar}
                    </div>
                    <div>
                      <h2 className="font-semibold text-surface-900">{selectedConversation.contact.name}</h2>
                      <p className="text-sm text-surface-500">{selectedConversation.contact.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-surface-100 text-surface-500">
                      <Phone size={20} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-surface-100 text-surface-500">
                      <Mail size={20} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-surface-100 text-surface-500">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {/* Sample messages */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-bl-md p-4 max-w-md shadow-sm border border-surface-100">
                        <p className="text-surface-800">{selectedConversation.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-surface-400">
                          <Clock size={12} />
                          <span>{selectedConversation.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-primary-500 text-white rounded-2xl rounded-br-md p-4 max-w-md">
                        <p>Perfeito! Vou verificar nossa agenda e retorno em breve com as opções de horário.</p>
                        <div className="flex items-center justify-end gap-2 mt-2 text-xs text-primary-100">
                          <span>10:35</span>
                          <CheckCheck size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-surface-200 p-4">
                  <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                      Enviar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={32} className="text-surface-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-700 mb-2">Selecione uma conversa</h3>
                  <p className="text-surface-500">Escolha uma conversa da lista para visualizar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

