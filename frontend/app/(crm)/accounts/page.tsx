import { Topbar } from "@/components/crm/Topbar";
import { AccountsTable } from "@/components/crm/AccountsTable";
import { apiClient } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  let accounts: any[] = [];

  const defaultAccounts = [
    {
      id: "a-1",
      name: "Ranipet Leather Works Pvt Ltd",
      industry: "Leather Exports",
      city: "Ranipet",
      state: "Tamil Nadu",
      gstin: "33AAACR1234F1Z5",
      lifetimeValue: 85000,
      contacts: [{ id: "c-1", firstName: "Ramesh", phone: "+919842155678", isPrimary: true }],
      deals: [{ id: "d-1", title: "Multilingual Leather Export Portal", dealValue: 85000, stage: "DISCOVERY" }],
    },
    {
      id: "a-2",
      name: "Vaniyambadi Spices Exporters",
      industry: "Agriculture Exports",
      city: "Vaniyambadi",
      state: "Tamil Nadu",
      gstin: "33AABCV5678H1Z2",
      lifetimeValue: 48000,
      contacts: [{ id: "c-2", firstName: "Syed", phone: "+919443211223", isPrimary: true }],
      deals: [{ id: "d-2", title: "Automated WhatsApp Bot", dealValue: 48000, stage: "PROPOSAL_SENT" }],
    },
    {
      id: "a-3",
      name: "Tirupur Global Weaves",
      industry: "Textile Exports",
      city: "Tirupur",
      state: "Tamil Nadu",
      gstin: "33AAACT9012K1Z9",
      lifetimeValue: 145000,
      contacts: [{ id: "c-3", firstName: "Kavitha", phone: "+919789012345", isPrimary: true }],
      deals: [{ id: "d-3", title: "B2B Commerce Store", dealValue: 145000, stage: "QUALIFIED" }],
    },
  ];

  try {
    const res = await apiClient.accounts.list();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      accounts = res.data;
    } else {
      accounts = defaultAccounts;
    }
  } catch {
    accounts = defaultAccounts;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Client Accounts Portfolio"
        subtitle="Organizations and enterprise clients serviced by AgniGrow across Tamil Nadu"
      />

      <div className="p-8 max-w-7xl w-full">
        <AccountsTable initialAccounts={accounts} />
      </div>
    </div>
  );
}
