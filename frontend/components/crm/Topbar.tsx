"use client";

import { useState } from "react";
import { Plus, Search, Bell, Shield, HelpCircle } from "lucide-react";
import { CreateLeadModal } from "./CreateLeadModal";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="h-16 px-6 border-b border-slate-800/80 bg-[#080b11]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">CRM</span>
            <span className="text-xs text-slate-600">/</span>
            <h1 className="text-sm font-semibold text-slate-100 tracking-tight">{title}</h1>
          </div>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Global Search input */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs w-64 focus-within:border-slate-700 focus-within:text-slate-200">
            <Search className="w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Quick search leads, deals, contacts..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
            />
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
              ⌘K
            </kbd>
          </div>

          {/* Quick Create Lead Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs tracking-wide shadow-xs transition active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>
        </div>
      </header>

      {/* Modal Dialog */}
      <CreateLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
