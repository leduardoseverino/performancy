'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Link2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Key,
  Globe,
  RefreshCw,
  Save,
  Info
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/store';
import { ZohoConfig } from '@/types';

const ZOHO_DOMAINS = [
  { value: 'com', label: 'zoho.com (US)' },
  { value: 'eu', label: 'zoho.eu (Europe)' },
  { value: 'in', label: 'zoho.in (India)' },
  { value: 'com.cn', label: 'zoho.com.cn (China)' },
  { value: 'com.au', label: 'zoho.com.au (Australia)' },
  { value: 'jp', label: 'zoho.jp (Japan)' },
];

export default function ConfiguracoesPage() {
  const { 
    zohoConfig, 
    setZohoConfig, 
    isZohoConnected, 
    sidebarCollapsed,
    fetchDeals 
  } = useAppStore();

  const [formData, setFormData] = useState<ZohoConfig>({
    clientId: '',
    clientSecret: '',
    refreshToken: '',
    domain: 'com',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (zohoConfig) {
      setFormData(zohoConfig);
    }
  }, [zohoConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Validate required fields
      if (!formData.clientId || !formData.clientSecret || !formData.refreshToken) {
        throw new Error('Todos os campos são obrigatórios');
      }

      setZohoConfig(formData);
      setSaveStatus('success');
      
      // Auto-fetch deals after saving
      setTimeout(async () => {
        try {
          await fetchDeals();
        } catch (error) {
          console.error('Failed to fetch deals:', error);
        }
      }, 500);
    } catch (error) {
      console.error('Failed to save config:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    
    try {
      // Test by trying to fetch deals
      await fetchDeals();
      setTestStatus('success');
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestStatus('error');
    }
  };

  const handleDisconnect = () => {
    setZohoConfig(null);
    setFormData({
      clientId: '',
      clientSecret: '',
      refreshToken: '',
      domain: 'com',
    });
    setSaveStatus('idle');
    setTestStatus('idle');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8 max-w-4xl">
          {/* Header */}
          <header className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
                <Settings size={20} className="text-surface-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-surface-900">
                Configurações
              </h1>
            </div>
            <p className="text-surface-500">
              Configure a integração com o Zoho CRM e outras preferências
            </p>
          </header>

          {/* Zoho Integration Card */}
          <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden animate-slide-in">
            {/* Card Header */}
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-200">
                    Z
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-surface-900">
                      Zoho CRM
                    </h2>
                    <p className="text-sm text-surface-500">
                      Sincronize seus deals automaticamente
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                  isZohoConnected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-surface-100 text-surface-600'
                }`}>
                  {isZohoConnected ? (
                    <>
                      <CheckCircle2 size={16} />
                      Conectado
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      Desconectado
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Como obter as credenciais do Zoho:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-600">
                    <li>Acesse <a href="https://api-console.zoho.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">api-console.zoho.com</a></li>
                    <li>Crie uma aplicação Self Client</li>
                    <li>Gere um Refresh Token com escopo: ZohoCRM.modules.ALL</li>
                    <li>Copie o Client ID, Client Secret e Refresh Token</li>
                  </ol>
                </div>
              </div>

              {/* Domain Select */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  <Globe size={16} className="inline mr-2" />
                  Domínio Zoho
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  {ZOHO_DOMAINS.map((domain) => (
                    <option key={domain.value} value={domain.value}>
                      {domain.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client ID */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  <Key size={16} className="inline mr-2" />
                  Client ID
                </label>
                <input
                  type="text"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  placeholder="1000.XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Client Secret */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  <Key size={16} className="inline mr-2" />
                  Client Secret
                </label>
                <input
                  type="password"
                  name="clientSecret"
                  value={formData.clientSecret}
                  onChange={handleInputChange}
                  placeholder="••••••••••••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Refresh Token */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  <RefreshCw size={16} className="inline mr-2" />
                  Refresh Token
                </label>
                <input
                  type="password"
                  name="refreshToken"
                  value={formData.refreshToken}
                  onChange={handleInputChange}
                  placeholder="1000.XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-surface-50 border-t border-surface-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isZohoConnected && (
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Desconectar
                  </button>
                )}
                
                {isZohoConnected && (
                  <button
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      testStatus === 'success'
                        ? 'bg-green-100 text-green-700'
                        : testStatus === 'error'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                    }`}
                  >
                    {testStatus === 'testing' ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Testando...
                      </>
                    ) : testStatus === 'success' ? (
                      <>
                        <CheckCircle2 size={16} />
                        Conexão OK
                      </>
                    ) : testStatus === 'error' ? (
                      <>
                        <AlertCircle size={16} />
                        Falha
                      </>
                    ) : (
                      <>
                        <Link2 size={16} />
                        Testar Conexão
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {saveStatus === 'success' && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Salvo com sucesso!
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    Erro ao salvar
                  </span>
                )}
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Salvar Configurações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="mt-6 p-4 bg-white rounded-2xl border border-surface-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-surface-900">Precisa de ajuda?</h3>
              <p className="text-sm text-surface-500">
                Consulte a documentação da API do Zoho CRM
              </p>
            </div>
            <a
              href="https://www.zoho.com/crm/developer/docs/api/v5/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
            >
              <ExternalLink size={16} />
              Documentação
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

