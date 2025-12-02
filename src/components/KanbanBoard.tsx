'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Deal, DealStage } from '@/types';
import { useAppStore } from '@/store';
import KanbanColumn from './KanbanColumn';
import DealCard from './DealCard';

interface KanbanBoardProps {
  deals: Deal[];
}

const stages: DealStage[] = [
  'Lead',
  'Discovery',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

export default function KanbanBoard({ deals }: KanbanBoardProps) {
  const { moveDealToStage, metrics } = useAppStore();
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find((d) => d.id === active.id);
    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    if (stages.includes(overId as DealStage)) {
      const deal = deals.find((d) => d.id === dealId);
      if (deal && deal.stage !== overId) {
        moveDealToStage(dealId, overId as DealStage);
      }
    }
  };

  const getDealsForStage = (stage: DealStage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageMetrics = (stage: DealStage) => {
    return metrics?.stageDistribution.find((s) => s.stage === stage);
  };

  return (
    <div className="animate-slide-in" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold text-surface-900">
          Kanban Board
        </h2>
        <p className="text-sm text-surface-500">
          Arraste os deals para mover entre stages
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
          {stages.map((stage) => {
            const stageDeals = getDealsForStage(stage);
            const stageMetrics = getStageMetrics(stage);

            return (
              <SortableContext
                key={stage}
                items={stageDeals.map((d) => d.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn
                  stage={stage}
                  deals={stageDeals}
                  metrics={stageMetrics}
                />
              </SortableContext>
            );
          })}
        </div>

        <DragOverlay>
          {activeDeal && <DealCard deal={activeDeal} isDragging />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

