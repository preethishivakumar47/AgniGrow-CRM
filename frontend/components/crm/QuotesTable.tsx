"use client";

import { useState } from "react";
import { formatINR, formatDate } from "@/lib/formatters";
import { FileText, CheckCircle2, Search } from "lucide-react";
import { markQuoteAcceptedAction } from "@/app/actions/quote-actions";

export interface QuoteItem {
  id: string;
  quoteNumber: string;
  totalAmount: any;
  items: any;
  validUntil: string | Date;
  isAccepted: boolean;
  createdAt: string | Date;
  deal: {
    id: string;
    title: string;
    account: { name: string };
    contact: { firstName: string; phone: string };
  };
}

export function QuotesTable({ initialQuotes }: { initialQuotes: QuoteItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = initialQuotes.filter((q) => {
    const term = searchTerm.toLowerCase();
    const num = q.quoteNumber.toLowerCase();
    const company = q.deal.account.name.toLowerCase();
    const dealTitle = q.deal.title.toLowerCase();
    return num.includes(term) || company.includes(term) || dealTitle.includes(term);
  });

  async function handleAccept(quoteId: string) {
    if (confirm("Mark this quotation as accepted by client and transition deal to WON?")) {
      await markQuoteAcceptedAction(quoteId);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-[#0f1420] border border-slate-800/80">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quotes by number (AG-2026...), client or title..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} Quotations
        </span>
      </div>

      <div className="rounded-lg border border-slate-800/80 bg-[#0f1420] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b0f17] text-[11px] font-semibold text-slate-400 font-mono tracking-wider">
                <th className="py-2.5 px-4">QUOTE #</th>
                <th className="py-2.5 px-4">CLIENT / COMPANY</th>
                <th className="py-2.5 px-4">SCOPE TITLE</th>
                <th className="py-2.5 px-4">AMOUNT (₹)</th>
                <th className="py-2.5 px-4">VALIDITY</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No proposals drafted yet.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-orange-400" />
                        <span>{q.quoteNumber}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{q.deal.account.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{q.deal.contact.firstName} ({q.deal.contact.phone})</div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {q.deal.title}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {formatINR(q.totalAmount)}
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      Until {formatDate(q.validUntil)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          q.isAccepted
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{q.isAccepted ? "ACCEPTED" : "PENDING"}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {!q.isAccepted && (
                        <button
                          onClick={() => handleAccept(q.id)}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Accept</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
