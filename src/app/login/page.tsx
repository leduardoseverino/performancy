'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chrome, Loader2, TrendingUp, Users, Target, Zap } from 'lucide-react';
import { useAuthStore, simulateGoogleLogin } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await simulateGoogleLogin();
      login(user);
      router.push('/');
    } catch (err) {
      setError('Falha ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  const features = [
    { icon: <TrendingUp size={24} />, title: 'Pipeline Inteligente', desc: 'Visualize seu funil de vendas em tempo real' },
    { icon: <Users size={24} />, title: 'Gestão de Deals', desc: 'Organize e acompanhe todas as oportunidades' },
    { icon: <Target size={24} />, title: 'Métricas Avançadas', desc: 'Tome decisões baseadas em dados' },
    { icon: <Zap size={24} />, title: 'Integração Zoho', desc: 'Sincronize automaticamente com seu CRM' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
              P
            </div>
            <span className="font-display font-bold text-3xl text-white tracking-tight">
              Performancy
            </span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl xl:text-6xl font-display font-bold text-white leading-tight mb-6">
            Transforme seu
            <span className="text-primary-400"> pipeline </span>
            em resultados
          </h1>
          <p className="text-xl text-surface-300 leading-relaxed">
            A plataforma completa para gestão de vendas que integra com seu Zoho CRM 
            e potencializa sua performance comercial.
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-primary-400 mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-surface-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              P
            </div>
            <span className="font-display font-bold text-3xl text-white tracking-tight">
              Performancy
            </span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-surface-500">
                Faça login para acessar sua conta
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-surface-200 rounded-2xl font-medium text-surface-700 hover:bg-surface-50 hover:border-surface-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <Loader2 size={22} className="animate-spin text-primary-500" />
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continuar com Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-surface-200" />
              <span className="text-sm text-surface-400">ou</span>
              <div className="flex-1 h-px bg-surface-200" />
            </div>

            {/* Demo Notice */}
            <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl">
              <p className="text-sm text-primary-700 text-center">
                <span className="font-semibold">🎭 Modo Demo:</span> Clique no botão acima para 
                simular login com Google e acessar a aplicação.
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs text-center text-surface-400">
              Ao continuar, você concorda com nossos{' '}
              <a href="#" className="text-primary-500 hover:underline">Termos de Serviço</a>
              {' '}e{' '}
              <a href="#" className="text-primary-500 hover:underline">Política de Privacidade</a>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-surface-400">
            © 2024 Performancy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

