import { Topbar } from "@/components/crm/Topbar";
import { TaskList } from "@/components/crm/TaskList";
import { apiClient } from "@/lib/api-client";
import { DEMO_TASKS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  let tasks: any[] = [];

  try {
    const res = await apiClient.tasks.list();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      tasks = res.data;
    } else {
      tasks = DEMO_TASKS;
    }
  } catch {
    tasks = DEMO_TASKS;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Follow-Up Commitments & Tasks"
        subtitle="Manage upcoming calls, proposal dispatches and milestone deadlines"
      />

      <div className="p-8 max-w-4xl w-full">
        <TaskList initialTasks={tasks} />
      </div>
    </div>
  );
}
