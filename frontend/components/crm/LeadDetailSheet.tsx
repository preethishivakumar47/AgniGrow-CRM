"use client";

import { useState } from "react";
import { 
  X, 
  PhoneCall, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2,
  FileText,
  User 
} from "lucide-react";
import { formatRelativeTime, getWhatsAppLink } from "@/lib/formatters";
import { addLeadActivityAction, updateLeadStatusAction } from "@/app/actions/lead-actions";

interface ActivityItem {
  id: string;
  type: string;
  content: string;
  createdAt: string | Date;
  user?: { name: string } | null;
}

interface LeadDetailSheetProps {
  lead: {
    id: string;
    firstName: string;
    lastName?: string | null;
    phone: string;
    email?: string | null;
    companyName?: string | null;
    service: string;
    budget: string;
    timeline: string;
    notes?: string | null;
    status: string;
    source: string;
    createdAt: string | Date;
    activities?: ActivityItem[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertClick: () => void;
}

export function LeadDetailSheet({
  lead,
  isOpen,
  onClose,
  onConvertClick,
}: LeadDetailSheetProps) {
  const [noteContent, setNoteContent] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  if (!isOpen || !lead) return null;

  const defaultWaMessage = `Hello ${lead.firstName}, this is AgniGrow regarding your ${lead.service} inquiry. We reviewed your scope and would love to schedule a quick 10-minute discovery call.`;
  const waUrl = getWhatsAppLink(lead.phone, defaultWaMessage);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteContent.trim() || !lead) return;
    setSubmittingNote(true);
    try {
      await addLeadActivityAction(lead.id, noteContent.trim(), "NOTE");
      setNoteContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingNote(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!lead) return;
    await updateLeadStatusAction(lead.id, newStatus);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b0f17] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-[#0e131d]">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {lead.status}
                </span>
                <h2 className="text-base font-semibold text-slate-100 mt-1.5">
                  {lead.firstName} {lead.lastName || ""}
                </h2>
                <p className="text-xs text-slate-400">
                  {lead.companyName || "No Company Specified"} • Source: {lead.source.replace(/_/g, " ")}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Action Bar */}
            <div className="flex items-center gap-2 mt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${lead.phone}`}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Call</span>
              </a>

              {lead.status !== "CONVERTED" && (
                <button
                  onClick={() => {
                    onClose();
                    onConvertClick();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Convert</span>
                </button>
              )}
            </div>
          </div>

          {/* Dossier Body */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Quick Scope Specs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-mono">SERVICE</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{lead.service}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-mono">BUDGET</p>
                <p className="text-xs font-semibold text-amber-400 mt-0.5 truncate">{lead.budget.replace("TIER_", "")}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-mono">TIMELINE</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{lead.timeline.replace(/_/g, " ")}</p>
              </div>
            </div>

            {/* Discovery Notes */}
            {lead.notes && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
                  <FileText className="w-3 h-3 text-orange-400" />
                  <span>Prospect Notes</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">{lead.notes}</p>
              </div>
            )}

            {/* Quick Status Bar */}
            <div className="flex items-center gap-1 p-1 rounded-md bg-slate-900 border border-slate-800">
              {["NEW", "CONTACTED", "QUALIFIED", "DISQUALIFIED"].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`flex-1 py-1 rounded text-[10px] font-mono font-medium transition ${
                    lead.status === st
                      ? "bg-orange-600 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Add Note / Activity */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Interaction Stream</span>
              </p>
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record meeting notes, discovery answers or next steps..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-slate-700 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingNote || !noteContent.trim()}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition disabled:opacity-40"
                  >
                    <Send className="w-3 h-3 text-orange-400" />
                    <span>Log Activity</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Timeline Feed */}
            <div className="space-y-2 pt-1">
              {lead.activities && lead.activities.length > 0 ? (
                lead.activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-amber-400 uppercase font-semibold">
                        {act.type}
                      </span>
                      <span className="text-slate-500">
                        {formatRelativeTime(act.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {act.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-500">
                  No previous activity recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
