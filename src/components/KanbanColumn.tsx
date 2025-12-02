'use client';

import { useDroppable } from '@dnd-kit/core';
import { Deal, DealStage, StageMetrics } from '@/types';
import DealCard from './DealCard';

interface KanbanColumnProps {
  stage: DealStage;
  deals: Deal[];
  metrics?: StageMetrics;
}

const stageColors: Record<DealStage, { dot: string; bg: string; border: string }> = {
  'Lead': { dot: 'bg-surface-400', bg: 'bg-surface-50', border: 'border-surface-200' },
  'Discovery': { dot: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  'Qualified': { dot: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  'Proposal': { dot: 'bg-primary-500', bg: 'bg-primary-50', border: 'border-primary-100' },
  'Negotiation': { dot: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
  'Closed Won': { dot: 'bg-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  'Closed Lost': { dot: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-100' },
};

export default function KanbanColumn({ stage, deals, metrics }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const colors = stageColors[stage];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 rounded-2xl border transition-all duration-200 ${
        isOver 
          ? `${colors.bg} ${colors.border} shadow-lg scale-[1.02]` 
          : 'bg-surface-50 border-surface-200'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-surface-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
            <h3 className="font-semibold text-surface-900">{stage}</h3>
          </div>
          <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} text-surface-700`}>
            {deals.length}
          </span>
        </div>
        
        {metrics && (
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-surface-500">Pipeline:</span>
              <span className="ml-1 font-medium text-surface-700">
                {formatCurrency(metrics.totalValue)}
              </span>
            </div>
            <div>
              <span className="text-surface-500">Conversão:</span>
              <span className="ml-1 font-medium text-surface-700">
                {metrics.conversionRate}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cards Container */}
      <div className="p-3 space-y-3 min-h-[200px] max-h-[calc(100vh-400px)] overflow-y-auto">
        {deals.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-sm text-surface-400 border-2 border-dashed border-surface-200 rounded-xl">
            Arraste deals aqui
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))
        )}
      </div>
    </div>
  );
}

