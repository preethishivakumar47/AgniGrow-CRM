import { Topbar } from "@/components/crm/Topbar";
import { QuotesTable } from "@/components/crm/QuotesTable";
import { apiClient } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  let quotes: any[] = [];
  let deals: any[] = [];

  const defaultQuotes = [
    {
      id: "q-1",
      quoteNumber: "AG-2026-0012",
      totalAmount: 85000,
      items: [
        { title: "Multilingual Web Portal", description: "Bespoke catalog and CMS", amount: 65000 },
        { title: "WhatsApp Desk Integration", description: "Automated inquiry routing", amount: 20000 },
      ],
      validUntil: new Date(Date.now() + 86400000 * 10).toISOString(),
      isAccepted: false,
      createdAt: new Date().toISOString(),
      deal: {
        id: "d-1",
        title: "Multilingual Leather Export Portal",
        account: { name: "Ranipet Leather Works Pvt Ltd" },
        contact: { firstName: "Ramesh", phone: "+919842155678" },
      },
    },
    {
      id: "q-2",
      quoteNumber: "AG-2026-0008",
      totalAmount: 48000,
      items: [
        { title: "WhatsApp Quotation Bot", description: "Automated catalog dispatcher", amount: 48000 },
      ],
      validUntil: new Date(Date.now() + 86400000 * 5).toISOString(),
      isAccepted: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      deal: {
        id: "d-2",
        title: "Automated WhatsApp Bot",
        account: { name: "Vaniyambadi Spices Exporters" },
        contact: { firstName: "Syed", phone: "+919443211223" },
      },
    },
  ];

  try {
    const [qRes, dRes] = await Promise.allSettled([
      apiClient.quotes.list(),
      apiClient.deals.list(),
    ]);

    if (qRes.status === "fulfilled" && Array.isArray(qRes.value.data) && qRes.value.data.length > 0) {
      quotes = qRes.value.data;
    } else {
      quotes = defaultQuotes;
    }

    if (dRes.status === "fulfilled" && Array.isArray(dRes.value.data)) {
      deals = dRes.value.data;
    }
  } catch {
    quotes = defaultQuotes;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Commercial Quotations & Estimates"
        subtitle="AgniGrow client fee estimates, payment terms and digital acceptance records"
      />

      <div className="p-8 max-w-7xl w-full">
        <QuotesTable initialQuotes={quotes} />
      </div>
    </div>
  );
}
