'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  format?: 'currency' | 'number' | 'percentage';
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  format = 'number',
  delay = 0,
}: MetricCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return new Intl.NumberFormat('pt-BR').format(val);
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return <TrendingUp size={14} className="text-emerald-500" />;
      case 'down':
        return <TrendingDown size={14} className="text-red-500" />;
      default:
        return <Minus size={14} className="text-surface-400" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':
        return 'text-emerald-600 bg-emerald-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-surface-600 bg-surface-100';
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl p-6 border border-surface-200 card-interactive animate-slide-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-surface-500">{title}</h3>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-display font-semibold text-surface-900 tracking-tight">
          {formatValue(value)}
        </p>

        <div className="flex items-center gap-3">
          {subtitle && (
            <p className="text-sm text-surface-500">{subtitle}</p>
          )}
          
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

