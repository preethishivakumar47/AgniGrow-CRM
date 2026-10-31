"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  ExternalLink, 
  User 
} from "lucide-react";
import { formatINR, formatDate, getWhatsAppLink } from "@/lib/formatters";
import { LeadDetailSheet } from "./LeadDetailSheet";
import { ConvertLeadModal } from "./ConvertLeadModal";

interface Lead {
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
  assignedUser?: { name: string } | null;
  activities?: any[];
}

interface LeadsTableProps {
  initialLeads: Lead[];
  users: Array<{ id: string; name: string }>;
}

export function LeadsTable({ initialLeads, users }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  const filteredLeads = initialLeads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.lastName || ""}`.toLowerCase();
    const phone = lead.phone.toLowerCase();
    const company = (lead.companyName || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      fullName.includes(term) || phone.includes(term) || company.includes(term);

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    const matchesService = serviceFilter === "ALL" || lead.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="space-y-3">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#0f1420] border border-slate-800/80">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, phone or company..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="PROPOSAL_SENT">Proposal Sent</option>
            <option value="CONVERTED">Converted</option>
            <option value="DISQUALIFIED">Disqualified</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-slate-700"
          >
            <option value="ALL">All Services</option>
            <option value="WEBSITE">Website & Portal</option>
            <option value="ECOMMERCE">E-Commerce</option>
            <option value="WHATSAPP_BOT">WhatsApp Bot</option>
            <option value="BRANDING">Brand Kit</option>
            <option value="ERP_POS">Cloud ERP / POS</option>
            <option value="EVENT_MICROSITE">Event Microsite</option>
          </select>
        </div>
      </div>

      {/* Leads Data Table */}
      <div className="rounded-lg border border-slate-800/80 bg-[#0f1420] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b0f17] text-[11px] font-semibold text-slate-400 font-mono tracking-wider">
                <th className="py-2.5 px-4">PROSPECT</th>
                <th className="py-2.5 px-4">SERVICE</th>
                <th className="py-2.5 px-4">BUDGET</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 px-4">SOURCE</th>
                <th className="py-2.5 px-4">ASSIGNED</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const waUrl = getWhatsAppLink(lead.phone, `Hi ${lead.firstName}, AgniGrow team here regarding your inquiry.`);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                          <span>{lead.firstName} {lead.lastName || ""}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lead.companyName || lead.phone}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-medium text-[11px] border border-slate-800">
                          {lead.service.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-amber-400">
                        {lead.budget.replace("TIER_", "")}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium font-mono ${
                            lead.status === "NEW"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : lead.status === "CONTACTED"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : lead.status === "QUALIFIED"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : lead.status === "CONVERTED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{lead.status}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">
                        {lead.source.replace(/_/g, " ")}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-300">
                        {lead.assignedUser?.name || "Unassigned"}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {lead.status !== "CONVERTED" && (
                            <button
                              onClick={() => setLeadToConvert(lead)}
                              title="Convert to Deal"
                              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-300 text-[11px] font-medium border border-slate-700 transition flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Convert</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Dossier Drawer */}
      <LeadDetailSheet
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onConvertClick={() => {
          if (selectedLead) setLeadToConvert(selectedLead);
        }}
      />

      {/* Lead-to-Deal Conversion Modal */}
      <ConvertLeadModal
        lead={leadToConvert}
        users={users}
        isOpen={!!leadToConvert}
        onClose={() => setLeadToConvert(null)}
      />
    </div>
  );
}
