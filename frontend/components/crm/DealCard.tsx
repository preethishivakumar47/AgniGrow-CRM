"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatINR } from "@/lib/formatters";
import { GripVertical, Building2, User } from "lucide-react";

export interface Deal {
  id: string;
  title: string;
  dealValue: any;
  service: string;
  stage: string;
  probability: number;
  account: { name: string };
  contact: { firstName: string; lastName?: string | null; phone: string };
  assignedUser: { name: string };
}

interface DealCardProps {
  deal: Deal;
  onSelectDeal?: (deal: Deal) => void;
}

export function DealCard({ deal, onSelectDeal }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: { deal },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3.5 rounded-lg bg-[#101622] border border-slate-800 hover:border-slate-700 transition shadow-xs space-y-2.5 cursor-pointer group"
      onClick={() => onSelectDeal?.(deal)}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold text-slate-100 leading-snug line-clamp-2">
          {deal.title}
        </h4>
        <button
          {...attributes}
          {...listeners}
          className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing p-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
        <span className="truncate">{deal.account.name}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        <span className="font-bold text-amber-400 font-mono">
          {formatINR(deal.dealValue)}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono border border-slate-800">
          {deal.service.replace(/_/g, " ")}
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[9px] border border-slate-700">
            {deal.assignedUser.name[0]}
          </div>
          <span className="truncate max-w-[90px]">{deal.assignedUser.name}</span>
        </div>
        <span className="font-mono text-slate-400">{deal.probability}% win</span>
      </div>
    </div>
  );
}
