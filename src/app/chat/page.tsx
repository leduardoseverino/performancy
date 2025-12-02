'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  Target,
  Users
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/store/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  { icon: <TrendingUp size={16} />, text: 'Analise meu pipeline de vendas' },
  { icon: <Target size={16} />, text: 'Quais deals têm maior probabilidade de fechar?' },
  { icon: <Users size={16} />, text: 'Sugira próximos passos para meus leads' },
  { icon: <Lightbulb size={16} />, text: 'Como melhorar minha taxa de conversão?' },
];

export default function ChatPage() {
  const { sidebarCollapsed, deals, metrics } = useAppStore();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá ${user?.given_name || 'usuário'}! 👋 Sou seu assistente de vendas com IA. Posso ajudá-lo a analisar seu pipeline, identificar oportunidades e fornecer insights sobre seus deals. Como posso ajudar hoje?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('pipeline') || lowerMessage.includes('funil')) {
      return `📊 **Análise do Pipeline**\n\nSeu pipeline atual tem **${metrics?.totalDeals || 0} deals** com valor total de **R$ ${((metrics?.pipelineTotal || 0) / 1000).toFixed(0)}k**.\n\n**Distribuição por stage:**\n${
        metrics?.stageDistribution.map(s => `• ${s.stage}: ${s.dealCount} deals (R$ ${(s.totalValue / 1000).toFixed(0)}k)`).join('\n') || 'Sem dados'
      }\n\n💡 **Recomendação:** Foque nos deals em Negotiation que têm maior probabilidade de fechamento. Considere fazer follow-up com os 2 deals nesse estágio.`;
    }
    
    if (lowerMessage.includes('probabilidade') || lowerMessage.includes('fechar')) {
      const highProbDeals = deals.filter(d => d.probability >= 60);
      return `🎯 **Deals com Alta Probabilidade**\n\nEncontrei **${highProbDeals.length} deals** com probabilidade ≥60%:\n\n${
        highProbDeals.map(d => `• **${d.name}** (${d.company})\n  Valor: R$ ${d.value.toLocaleString('pt-BR')} | Prob: ${d.probability}%`).join('\n\n') || 'Nenhum deal encontrado'
      }\n\n💡 **Sugestão:** Priorize contato com esses deals esta semana. A proximidade do fechamento exige atenção especial.`;
    }
    
    if (lowerMessage.includes('lead') || lowerMessage.includes('próximo')) {
      const leads = deals.filter(d => d.stage === 'Lead' || d.stage === 'Discovery');
      return `📋 **Próximos Passos para Leads**\n\n**${leads.length} leads** precisam de atenção:\n\n${
        leads.slice(0, 3).map(d => `• **${d.name}**\n  ✅ Agendar call de descoberta\n  ✅ Enviar material institucional\n  ✅ Qualificar necessidades`).join('\n\n')
      }\n\n💡 **Dica:** Leads que ficam mais de 7 dias sem contato têm 50% menos chance de conversão.`;
    }
    
    if (lowerMessage.includes('conversão') || lowerMessage.includes('melhorar')) {
      return `📈 **Como Melhorar sua Taxa de Conversão**\n\nSua taxa atual: **${Math.round(metrics?.conversionRate || 0)}%**\n\n**Recomendações:**\n\n1. **Qualificação rigorosa** - Invista mais tempo qualificando leads antes de avançar\n\n2. **Follow-up estruturado** - Crie cadências de contato automáticas\n\n3. **Proposta personalizada** - Adapte cada proposta às dores específicas do cliente\n\n4. **Reduza o ciclo** - Identifique gargalos que atrasam o fechamento\n\n5. **Peça referências** - Clientes satisfeitos indicam novos negócios\n\n💡 **Meta sugerida:** Aumente para 25% nos próximos 3 meses focando nos pontos acima.`;
    }
    
    return `Entendi sua pergunta! 🤔\n\nPosso ajudá-lo com:\n• Análise do pipeline de vendas\n• Identificação de deals prioritários\n• Sugestões de próximos passos\n• Estratégias para melhorar conversão\n• Insights sobre seus dados\n\nTente perguntar algo mais específico sobre seus deals ou métricas de vendas!`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-surface-200 px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-surface-900">
                  Assistente de Vendas IA
                </h1>
                <p className="text-sm text-surface-500">
                  Analise dados, obtenha insights e melhore sua performance
                </p>
              </div>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant'
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                      : 'bg-gradient-to-br from-primary-500 to-primary-600'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot size={20} className="text-white" />
                    ) : (
                      <User size={20} className="text-white" />
                    )}
                  </div>

                  {/* Message */}
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block rounded-2xl p-4 max-w-xl ${
                      message.role === 'assistant'
                        ? 'bg-white border border-surface-200 text-left'
                        : 'bg-primary-500 text-white'
                    }`}>
                      <p className={`whitespace-pre-wrap ${
                        message.role === 'assistant' ? 'text-surface-800' : ''
                      }`}>
                        {message.content}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600">
                          <ThumbsUp size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600">
                          <ThumbsDown size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600">
                          <Copy size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600">
                          <RefreshCw size={14} />
                        </button>
                        <span className="text-xs text-surface-400 ml-2">
                          <Clock size={12} className="inline mr-1" />
                          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="bg-white border border-surface-200 rounded-2xl p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-8 pb-4">
              <div className="max-w-3xl mx-auto">
                <p className="text-sm text-surface-500 mb-3">Sugestões:</p>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="flex items-center gap-2 p-3 bg-white rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                    >
                      <span className="text-primary-500">{prompt.icon}</span>
                      <span className="text-sm text-surface-700">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="bg-white border-t border-surface-200 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte sobre seus deals, métricas ou estratégias..."
                  className="flex-1 px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-surface-400 text-center mt-2">
                IA pode cometer erros. Verifique informações importantes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

