"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { formatINR } from "@/lib/formatters";

export interface AccountItem {
  id: string;
  name: string;
  industry?: string | null;
  gstin?: string | null;
  city?: string | null;
  state?: string | null;
  lifetimeValue: any;
  contacts?: Array<{ id: string; firstName: string; lastName?: string | null; phone: string; isPrimary: boolean }>;
  deals?: Array<{ id: string; title: string; dealValue: any; stage: string }>;
}

export function AccountsTable({ initialAccounts }: { initialAccounts: AccountItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = initialAccounts.filter((a) => {
    const term = searchTerm.toLowerCase();
    const name = a.name.toLowerCase();
    const industry = (a.industry || "").toLowerCase();
    const city = (a.city || "").toLowerCase();
    return name.includes(term) || industry.includes(term) || city.includes(term);
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
            placeholder="Search companies by name, sector or location..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} Enterprise Accounts
        </span>
      </div>

      <div className="rounded-lg border border-slate-800/80 bg-[#0f1420] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b0f17] text-[11px] font-semibold text-slate-400 font-mono tracking-wider">
                <th className="py-2.5 px-4">ENTERPRISE NAME</th>
                <th className="py-2.5 px-4">INDUSTRY</th>
                <th className="py-2.5 px-4">LOCATION</th>
                <th className="py-2.5 px-4">PRIMARY CONTACT</th>
                <th className="py-2.5 px-4">PIPELINE</th>
                <th className="py-2.5 px-4 text-right">LIFETIME VALUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No enterprise accounts found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const primaryContact = a.contacts?.find((c) => c.isPrimary) || a.contacts?.[0];
                  const totalDealsValue = (a.deals || []).reduce((sum, d) => sum + Number(d.dealValue || 0), 0);

                  return (
                    <tr key={a.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100">{a.name}</div>
                        {a.gstin && (
                          <div className="text-[10px] font-mono text-slate-500">
                            GSTIN: {a.gstin}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-[11px] text-slate-300 border border-slate-800">
                          {a.industry || "General Commercial"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{a.city || "Vaniyambadi"}, {a.state || "Tamil Nadu"}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {primaryContact ? (
                          <div>
                            <span className="font-medium text-slate-200">
                              {primaryContact.firstName} {primaryContact.lastName || ""}
                            </span>
                            <p className="text-[10px] text-slate-500 font-mono">{primaryContact.phone}</p>
                          </div>
                        ) : (
                          <span className="text-slate-600">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-400">
                          {a.deals?.length || 0} active
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                        {formatINR(totalDealsValue || a.lifetimeValue)}
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
