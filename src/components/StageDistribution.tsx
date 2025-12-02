'use client';

import { StageMetrics } from '@/types';

interface StageDistributionProps {
  stages: StageMetrics[];
}

const stageColors: Record<string, string> = {
  'Lead': 'bg-surface-400',
  'Discovery': 'bg-blue-500',
  'Qualified': 'bg-emerald-500',
  'Proposal': 'bg-primary-500',
  'Negotiation': 'bg-purple-500',
  'Closed Won': 'bg-green-600',
  'Closed Lost': 'bg-red-500',
};

const stageColorsDot: Record<string, string> = {
  'Lead': 'bg-surface-400',
  'Discovery': 'bg-blue-500',
  'Qualified': 'bg-emerald-500',
  'Proposal': 'bg-primary-500',
  'Negotiation': 'bg-purple-500',
  'Closed Won': 'bg-green-600',
  'Closed Lost': 'bg-red-500',
};

export default function StageDistribution({ stages }: StageDistributionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(...stages.map(s => s.totalValue));

  return (
    <div className="bg-white rounded-2xl p-6 border border-surface-200 animate-slide-in" style={{ animationDelay: '200ms' }}>
      <h2 className="text-xl font-display font-semibold text-surface-900 mb-6">
        Distribuição por Stage
      </h2>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const barWidth = maxValue > 0 ? (stage.totalValue / maxValue) * 100 : 0;
          
          return (
            <div 
              key={stage.stage} 
              className="group animate-slide-in"
              style={{ animationDelay: `${300 + index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${stageColorsDot[stage.stage]}`} />
                  <span className="text-sm font-medium text-surface-700 truncate">
                    {stage.stage}
                  </span>
                  <span className="text-sm text-surface-400">
                    {stage.dealCount} {stage.dealCount === 1 ? 'deal' : 'deals'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-surface-900 tabular-nums">
                  {formatCurrency(stage.totalValue)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-2 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${stageColors[stage.stage]}`}
                  style={{ 
                    width: `${barWidth}%`,
                    transitionDelay: `${300 + index * 50}ms`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

