"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { formatINR } from "@/lib/formatters";
import { DealCard, Deal } from "./DealCard";
import { updateDealStageAction } from "@/app/actions/deal-actions";

const STAGES = [
  { id: "DISCOVERY", title: "Discovery", color: "#3b82f6" },
  { id: "PROPOSAL_DRAFTED", title: "Proposal Drafted", color: "#8b5cf6" },
  { id: "PROPOSAL_SENT", title: "Proposal Sent", color: "#f59e0b" },
  { id: "NEGOTIATION", title: "Negotiation", color: "#f97316" },
  { id: "CLOSED_WON", title: "Closed Won", color: "#10b981" },
  { id: "CLOSED_LOST", title: "Closed Lost", color: "#ef4444" },
];

function KanbanColumn({
  stage,
  deals,
  totalValue,
  onSelectDeal,
}: {
  stage: { id: string; title: string; color: string };
  deals: Deal[];
  totalValue: number;
  onSelectDeal?: (deal: Deal) => void;
}) {
  const { setNodeRef } = useDroppable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      className="w-72 shrink-0 flex flex-col rounded-xl bg-[#0b0f17] border border-slate-800/80 overflow-hidden max-h-[calc(100vh-140px)]"
    >
      {/* Top 2px Stage Accent Bar */}
      <div className="h-1 w-full" style={{ backgroundColor: stage.color }} />

      {/* Column Header */}
      <div className="p-3 border-b border-slate-800 bg-[#0e131d]/60">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
            <span>{stage.title}</span>
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-bold border border-slate-700">
            {deals.length}
          </span>
        </div>
        <p className="text-[11px] font-mono text-amber-400 mt-1 font-semibold">
          {formatINR(totalValue)}
        </p>
      </div>

      {/* Cards Scrollable Body */}
      <div className="p-2 space-y-2 overflow-y-auto flex-1">
        <SortableContext
          items={deals.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onSelectDeal={onSelectDeal} />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <div className="h-24 rounded-lg border border-dashed border-slate-800 flex items-center justify-center text-[11px] text-slate-600">
            No active deals
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ initialDeals }: { initialDeals: Deal[] }) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const deal = deals.find((d) => d.id === event.active.id);
    if (deal) setActiveDeal(deal);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const targetStage = over.id as string;

    const currentDeal = deals.find((d) => d.id === dealId);
    if (!currentDeal || currentDeal.stage === targetStage) return;

    let lostReason: string | undefined = undefined;
    if (targetStage === "CLOSED_LOST") {
      const reason = window.prompt("Mandatory: Please specify why this deal was marked lost (e.g. Budget mismatch, Chose competitor):");
      if (!reason || !reason.trim()) {
        alert("Action cancelled: Lost reason is required.");
        return;
      }
      lostReason = reason.trim();
    }

    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: targetStage } : d))
    );

    try {
      await updateDealStageAction(dealId, targetStage as any, lostReason);
    } catch (err) {
      console.error("Failed to update deal stage", err);
      setDeals(initialDeals);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3.5 overflow-x-auto pb-6 pt-1">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const totalValue = stageDeals.reduce((sum, d) => {
            const val = typeof d.dealValue === "string" ? parseFloat(d.dealValue) : Number(d.dealValue);
            return sum + (isNaN(val) ? 0 : val);
          }, 0);

          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={stageDeals}
              totalValue={totalValue}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
