"use client";

import { useState } from "react";
import { X, Loader2, UserPlus } from "lucide-react";
import { createLeadAction } from "@/app/actions/lead-actions";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLeadModal({ isOpen, onClose }: CreateLeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: formData.get("firstName") as string,
      lastName: (formData.get("lastName") as string) || undefined,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || undefined,
      companyName: (formData.get("companyName") as string) || undefined,
      service: formData.get("service") as any,
      budget: formData.get("budget") as any,
      timeline: formData.get("timeline") as any,
      notes: (formData.get("notes") as string) || undefined,
      source: "MANUAL",
    };

    try {
      await createLeadAction(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-xl bg-[#0f1420] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0b0f17]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-800 text-orange-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-slate-100">Create New Prospect Lead</h2>
              <p className="text-[11px] text-slate-400">Record commercial requirements and contact information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                First Name *
              </label>
              <input
                required
                name="firstName"
                placeholder="e.g. Karthik"
                className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                placeholder="e.g. Ramasamy"
                className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phone (WhatsApp) *
              </label>
              <input
                required
                name="phone"
                placeholder="+91 98421 55678"
                className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Work Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="karthik@client.com"
                className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Company / Business Organization
            </label>
            <input
              name="companyName"
              placeholder="e.g. Ranipet Leather Works Pvt Ltd"
              className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Service Scope
              </label>
              <select
                name="service"
                defaultValue="WEBSITE"
                className="w-full px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
              >
                <option value="WEBSITE">Website & Portal</option>
                <option value="ECOMMERCE">E-Commerce Store</option>
                <option value="WHATSAPP_BOT">WhatsApp Bot</option>
                <option value="BRANDING">Brand Kit</option>
                <option value="ERP_POS">Cloud ERP / POS</option>
                <option value="EVENT_MICROSITE">Event Microsite</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Budget Tier
              </label>
              <select
                name="budget"
                defaultValue="TIER_30K_60K"
                className="w-full px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
              >
                <option value="TIER_15K_30K">₹15k – ₹30k</option>
                <option value="TIER_30K_60K">₹30k – ₹60k</option>
                <option value="TIER_60K_120K">₹60k – ₹1.2L</option>
                <option value="TIER_120K_PLUS">₹1.2L+</option>
                <option value="DISCUSS">Discuss Scope</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Timeline
              </label>
              <select
                name="timeline"
                defaultValue="WEEKS_2_TO_4"
                className="w-full px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
              >
                <option value="UNDER_2_WEEKS">&lt; 2 Weeks</option>
                <option value="WEEKS_2_TO_4">2 – 4 Weeks</option>
                <option value="MONTHS_1_TO_2">1 – 2 Months</option>
                <option value="FLEXIBLE">Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Discovery Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Record preliminary requirements or client scoping details..."
              className="w-full px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-slate-700 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
