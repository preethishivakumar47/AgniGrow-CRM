"use client";

import { useState } from "react";
import { X, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { convertLeadAction } from "@/app/actions/lead-actions";

interface ConvertLeadModalProps {
  lead: {
    id: string;
    firstName: string;
    lastName?: string | null;
    phone: string;
    email?: string | null;
    companyName?: string | null;
    service: string;
    budget: string;
  } | null;
  users: Array<{ id: string; name: string }>;
  isOpen: boolean;
  onClose: () => void;
}

export function ConvertLeadModal({ lead, users, isOpen, onClose }: ConvertLeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !lead) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!lead) return;
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      leadId: lead.id,
      accountName: formData.get("accountName") as string,
      industry: (formData.get("industry") as string) || undefined,
      dealTitle: formData.get("dealTitle") as string,
      dealValue: parseFloat(formData.get("dealValue") as string) || 0,
      assignedUserId: formData.get("assignedUserId") as string,
      expectedCloseDate: (formData.get("expectedCloseDate") as string) || undefined,
    };

    try {
      await convertLeadAction(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to convert lead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-xl bg-[#0f1420] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0b0f17]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-slate-100">Convert Lead to Deal</h2>
              <p className="text-[11px] text-slate-400">
                Spins up an Account, Primary Contact & Active Pipeline Deal
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 text-xs rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
              {error}
            </div>
          )}

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-0.5">
            <p className="text-slate-500 font-mono text-[10px]">CONVERTING PROSPECT</p>
            <p className="font-semibold text-slate-200">
              {lead.firstName} {lead.lastName || ""} ({lead.phone})
            </p>
            <p className="text-amber-400 text-[11px] font-mono">Scope: {lead.service}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Account / Business Organization Name *
            </label>
            <input
              required
              name="accountName"
              defaultValue={lead.companyName || `${lead.firstName}'s Enterprise`}
              className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Industry / Sector
            </label>
            <input
              name="industry"
              placeholder="e.g. Leather Exports, Food & Spices, Textiles"
              className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Initial Deal Title *
            </label>
            <input
              required
              name="dealTitle"
              defaultValue={`${lead.service} Portal & Implementation`}
              className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Estimated Deal Value (₹) *
              </label>
              <input
                required
                type="number"
                name="dealValue"
                defaultValue={65000}
                className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assign Sales Rep *
              </label>
              <select
                required
                name="assignedUserId"
                defaultValue={users[0]?.id}
                className="w-full px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
              <span>Complete Conversion</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
