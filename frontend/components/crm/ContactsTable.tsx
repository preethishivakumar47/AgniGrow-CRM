"use client";

import { useState } from "react";
import { Search, MessageSquare, PhoneCall, Building2, User } from "lucide-react";
import { getWhatsAppLink } from "@/lib/formatters";

export interface ContactItem {
  id: string;
  firstName: string;
  lastName?: string | null;
  phone: string;
  email?: string | null;
  designation?: string | null;
  isPrimary: boolean;
  account: { id: string; name: string; city?: string | null };
  deals?: Array<{ id: string; title: string; dealValue: any; stage: string }>;
}

export function ContactsTable({ initialContacts }: { initialContacts: ContactItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = initialContacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName || ""}`.toLowerCase();
    const phone = c.phone.toLowerCase();
    const company = c.account.name.toLowerCase();
    return fullName.includes(term) || phone.includes(term) || company.includes(term);
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-[#0f1420] border border-slate-800/80">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts by name, company or phone..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} Contacts
        </span>
      </div>

      <div className="rounded-lg border border-slate-800/80 bg-[#0f1420] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b0f17] text-[11px] font-semibold text-slate-400 font-mono tracking-wider">
                <th className="py-2.5 px-4">CONTACT PERSON</th>
                <th className="py-2.5 px-4">ASSOCIATED COMPANY</th>
                <th className="py-2.5 px-4">DESIGNATION</th>
                <th className="py-2.5 px-4">DIRECT CHANNELS</th>
                <th className="py-2.5 px-4 text-right">PIPELINE DEALS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const waUrl = getWhatsAppLink(c.phone, `Hi ${c.firstName}, reaching out from AgniGrow.`);
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center font-bold text-xs">
                            {c.firstName[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200">
                              {c.firstName} {c.lastName || ""}
                            </span>
                            {c.isPrimary && (
                              <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                                Primary
                              </span>
                            )}
                            <p className="text-[11px] text-slate-400">{c.email || "-"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-200">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{c.account.name}</span>
                        </div>
                        {c.account.city && (
                          <span className="text-[10px] text-slate-500 font-mono">{c.account.city}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {c.designation || "Decision Maker"}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-medium transition"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`tel:${c.phone}`}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition"
                          >
                            <PhoneCall className="w-3 h-3 text-amber-400" />
                            <span>{c.phone}</span>
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-400">
                          {c.deals?.length || 0} active
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
