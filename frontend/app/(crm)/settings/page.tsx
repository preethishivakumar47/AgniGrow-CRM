import { Topbar } from "@/components/crm/Topbar";
import { SettingsView } from "@/components/crm/SettingsView";
import { apiClient } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let users: any[] = [];

  const defaultUsers = [
    {
      id: "admin-demo-uuid",
      name: "Arish Srinivasan",
      email: "admin@agnigrow.in",
      role: "ADMIN",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "rep-demo-uuid",
      name: "Karthik Sales Rep",
      email: "sales@agnigrow.in",
      role: "EMPLOYEE",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    const res = await apiClient.team.list();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      users = res.data;
    } else {
      users = defaultUsers;
    }
  } catch {
    users = defaultUsers;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Agency Configuration & Staff"
        subtitle="Manage operating credentials, webhooks, API tokens and staff access"
      />
      <div className="p-8 max-w-7xl w-full">
        <SettingsView initialUsers={users} />
      </div>
    </div>
  );
}
