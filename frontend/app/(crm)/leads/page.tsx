import { Topbar } from "@/components/crm/Topbar";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { apiClient } from "@/lib/api-client";
import { DEMO_LEADS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  let leads: any[] = [];
  let users: any[] = [
    { id: "admin-demo-uuid", name: "Arish Srinivasan" },
    { id: "rep-demo-uuid", name: "Karthik Sales Rep" },
  ];

  try {
    const [leadsRes, teamRes] = await Promise.allSettled([
      apiClient.leads.list(),
      apiClient.team.list(),
    ]);

    if (leadsRes.status === "fulfilled" && Array.isArray(leadsRes.value.data) && leadsRes.value.data.length > 0) {
      leads = leadsRes.value.data;
    } else {
      leads = DEMO_LEADS;
    }

    if (teamRes.status === "fulfilled" && Array.isArray(teamRes.value.data) && teamRes.value.data.length > 0) {
      users = teamRes.value.data;
    }
  } catch {
    leads = DEMO_LEADS;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Inbound Leads Hub"
        subtitle="Manage prospective clients from web scoper, direct calls and WhatsApp desk"
      />

      <div className="p-8 max-w-7xl w-full">
        <LeadsTable initialLeads={leads} users={users} />
      </div>
    </div>
  );
}
