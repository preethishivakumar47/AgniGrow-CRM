"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Plus 
} from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { toggleTaskStatusAction, createTaskAction } from "@/app/actions/task-actions";

export interface TaskItem {
  id: string;
  title: string;
  type: string;
  dueDate: string | Date;
  priority: string;
  status: string;
  lead?: { firstName: string; lastName?: string | null; phone: string } | null;
  deal?: { title: string } | null;
}

export function TaskList({ initialTasks }: { initialTasks: TaskItem[] }) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<any>("CALL");
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [newPriority, setNewPriority] = useState<any>("MEDIUM");

  async function handleToggle(task: TaskItem) {
    const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
    await toggleTaskStatusAction(task.id, task.status as any);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await createTaskAction({
        title: newTitle.trim(),
        type: newType,
        dueDate: newDueDate,
        priority: newPriority,
      });

      if (res.task) {
        setTasks((prev) => [res.task as any, ...prev]);
        setNewTitle("");
        setIsAdding(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Action Queue & Deadlines</h2>
          <p className="text-xs text-slate-400">
            Pipeline commitments, client follow-up calls and proposal dispatches
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-orange-400" />
          <span>New Task</span>
        </button>
      </div>

      {/* Quick Add Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-3.5 rounded-lg bg-[#0f1420] border border-slate-800 space-y-3">
          <input
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Call Karthik regarding export catalog quotation approval"
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
          />
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
            >
              <option value="CALL">Call</option>
              <option value="WHATSAPP_FOLLOW_UP">WhatsApp Follow-Up</option>
              <option value="SEND_PROPOSAL">Send Proposal</option>
              <option value="MEETING">Meeting</option>
              <option value="DEADLINE">Deadline</option>
            </select>

            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
            />

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            <button
              type="submit"
              className="ml-auto px-3.5 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task List items */}
      <div className="space-y-1.5">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-lg bg-[#0f1420] border border-slate-800/80">
            No upcoming tasks scheduled.
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";
            const isOverdue = !isCompleted && new Date(task.dueDate) < new Date();

            return (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition flex items-center justify-between gap-3 ${
                  isCompleted
                    ? "bg-slate-900/30 border-slate-800/40 opacity-40"
                    : isOverdue
                    ? "bg-rose-950/20 border-rose-900/40"
                    : "bg-[#0f1420] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(task)}
                    className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div>
                    <p
                      className={`text-xs font-medium text-slate-200 ${
                        isCompleted ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                      <span className="uppercase text-amber-400 text-[10px]">
                        {task.type.replace(/_/g, " ")}
                      </span>
                      <span>•</span>
                      <span>Due {formatDate(task.dueDate)}</span>
                      {task.lead && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300">
                            {task.lead.firstName} ({task.lead.phone})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isOverdue && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-400 border border-rose-500/20 font-mono">
                      <Flame className="w-3 h-3" />
                      <span>OVERDUE</span>
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-medium font-mono px-1.5 py-0.2 rounded ${
                      task.priority === "URGENT"
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        : task.priority === "HIGH"
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
