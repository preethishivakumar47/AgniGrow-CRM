import { Topbar } from "@/components/crm/Topbar";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { apiClient } from "@/lib/api-client";
import { DEMO_DEALS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  let deals: any[] = [];

  try {
    const res = await apiClient.deals.list();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      deals = res.data;
    } else {
      deals = DEMO_DEALS;
    }
  } catch {
    deals = DEMO_DEALS;
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Topbar
        title="Sales Deal Pipeline"
        subtitle="Drag-and-drop opportunities through stages to forecast and close revenue"
      />

      <div className="p-8 flex-1 overflow-x-auto min-w-0">
        <KanbanBoard initialDeals={deals} />
      </div>
    </div>
  );
}
