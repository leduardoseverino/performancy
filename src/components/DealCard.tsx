'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, Calendar, User2 } from 'lucide-react';
import { Deal } from '@/types';
import { useAppStore } from '@/store';

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export default function DealCard({ deal, isDragging = false }: DealCardProps) {
  const { setSelectedDeal } = useAppStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const isActuallyDragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSelectedDeal(deal)}
      className={`relative bg-white rounded-xl border border-surface-200 p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isActuallyDragging
          ? 'shadow-xl scale-105 opacity-90 rotate-2'
          : 'hover:shadow-md hover:border-surface-300'
      }`}
    >
      {/* Deal Name */}
      <h4 className="font-medium text-surface-900 text-sm mb-2 line-clamp-2">
        {deal.name}
      </h4>

      {/* Company */}
      <div className="flex items-center gap-1.5 text-surface-500 text-xs mb-3">
        <Building2 size={12} />
        <span className="truncate">{deal.company}</span>
      </div>

      {/* Value */}
      <div className="text-lg font-display font-semibold text-surface-900 mb-3">
        {formatCurrency(deal.value)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-100">
        <div className="flex items-center gap-1.5 text-surface-400 text-xs">
          <Calendar size={12} />
          <span>{formatDate(deal.expectedCloseDate)}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-medium">
            {deal.owner.charAt(0)}
          </div>
        </div>
      </div>

      {/* Probability Badge */}
      <div className="absolute top-2 right-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          deal.probability >= 80 
            ? 'bg-green-100 text-green-700'
            : deal.probability >= 50
              ? 'bg-primary-100 text-primary-700'
              : deal.probability >= 30
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-surface-100 text-surface-600'
        }`}>
          {deal.probability}%
        </span>
      </div>
    </div>
  );
}

