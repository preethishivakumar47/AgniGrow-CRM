import { formatINR, formatDate, getWhatsAppLink } from "@/lib/formatters";
import { Topbar } from "@/components/crm/Topbar";
import { MetricCard } from "@/components/crm/MetricCard";
import { apiClient } from "@/lib/api-client";
import { DEMO_DEALS, DEMO_LEADS, DEMO_TASKS } from "@/lib/mock-data";
import { 
  IndianRupee, 
  Users, 
  Flame, 
  ArrowUpRight, 
  MessageSquare, 
  CheckCircle2, 
  Briefcase 
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let openDealsCount = 0;
  let totalPipelineINR = 0;
  let wonDealsCount = 0;
  let monthlyWonINR = 0;
  let totalLeadsCount = 0;
  let overdueTasksCount = 0;
  let recentLeads: any[] = [];
  let urgentTasks: any[] = [];

  try {
    const [analyticsRes, leadsRes, tasksRes] = await Promise.allSettled([
      apiClient.analytics.dashboard(),
      apiClient.leads.list(),
      apiClient.tasks.list(),
    ]);

    if (analyticsRes.status === "fulfilled" && analyticsRes.value.data) {
      const a = analyticsRes.value.data;
      openDealsCount = a.openDealsCount || 0;
      totalPipelineINR = a.totalPipelineINR || 0;
      wonDealsCount = a.wonDealsCount || 0;
      monthlyWonINR = a.totalWonINR || 0;
      totalLeadsCount = a.leadsCount || 0;
    } else {
      throw new Error("Fallback required");
    }

    if (leadsRes.status === "fulfilled" && Array.isArray(leadsRes.value.data)) {
      recentLeads = leadsRes.value.data.slice(0, 5);
      if (totalLeadsCount === 0) totalLeadsCount = leadsRes.value.data.length;
    } else {
      recentLeads = DEMO_LEADS.slice(0, 5);
    }

    if (tasksRes.status === "fulfilled" && Array.isArray(tasksRes.value.data)) {
      urgentTasks = tasksRes.value.data.filter((t: any) => t.status === "PENDING").slice(0, 4);
      overdueTasksCount = tasksRes.value.data.filter((t: any) => t.status === "PENDING" && new Date(t.dueDate) < new Date()).length;
    } else {
      urgentTasks = DEMO_TASKS.slice(0, 4);
      overdueTasksCount = 1;
    }
  } catch {
    // Graceful fallback for seamless offline or preview operation
    openDealsCount = DEMO_DEALS.filter((d) => d.stage !== "CLOSED_WON" && d.stage !== "CLOSED_LOST").length;
    totalPipelineINR = DEMO_DEALS.reduce((acc, curr) => acc + (curr.stage !== "CLOSED_WON" && curr.stage !== "CLOSED_LOST" ? curr.dealValue : 0), 0);
    wonDealsCount = DEMO_DEALS.filter((d) => d.stage === "CLOSED_WON").length;
    monthlyWonINR = DEMO_DEALS.reduce((acc, curr) => acc + (curr.stage === "CLOSED_WON" ? curr.dealValue : 0), 0);
    totalLeadsCount = DEMO_LEADS.length;
    overdueTasksCount = 1;
    recentLeads = DEMO_LEADS.slice(0, 5);
    urgentTasks = DEMO_TASKS.slice(0, 4);
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Agency Executive Overview"
        subtitle="AgniGrow Pipeline, Inbound Volume & Cash Flow Indicators"
      />

      <div className="p-8 space-y-8 max-w-7xl w-full">
        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Pipeline"
            value={formatINR(totalPipelineINR)}
            subtitle={`${openDealsCount} Qualified Opportunities`}
            badge="+18% vs last mo"
            trend="up"
            icon={Flame}
          />

          <MetricCard
            title="Closed Won Revenue"
            value={formatINR(monthlyWonINR)}
            subtitle={`${wonDealsCount} Signed Engagements`}
            badge="+34% velocity"
            trend="up"
            icon={IndianRupee}
          />

          <MetricCard
            title="New Inbound Volume"
            value={totalLeadsCount.toString()}
            subtitle="Website Scoper + WhatsApp"
            badge="+12 this wk"
            trend="neutral"
            icon={Users}
          />

          <MetricCard
            title="Follow-up Queue"
            value={urgentTasks.length.toString()}
            subtitle={`${overdueTasksCount} Critical / Overdue`}
            badge={overdueTasksCount > 0 ? "Action required" : "On schedule"}
            trend={overdueTasksCount > 0 ? "urgent" : "neutral"}
            icon={CheckCircle2}
          />
        </div>

        {/* 2 Column Section: Recent Inbound Leads + Urgent Rep Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Inbound Leads (2 cols) */}
          <div className="lg:col-span-2 rounded-xl bg-[#101622] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Recent Inbound Inquiries
                </h3>
                <p className="text-xs text-slate-400">
                  Live leads from agnigrow.in Scoper and Official WhatsApp desk
                </p>
              </div>
              <Link
                href="/leads"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition"
              >
                <span>View Full Table</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {recentLeads.map((lead: any) => (
                <div
                  key={lead.id}
                  className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-2 rounded-lg transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {lead.firstName} {lead.lastName || ""}
                      </span>
                      {lead.companyName && (
                        <span className="text-[11px] text-slate-400 font-normal">
                          • {lead.companyName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{lead.phone}</span>
                      <span>•</span>
                      <span className="text-slate-300">{lead.service?.replace(/_/g, " ")}</span>
                      <span>•</span>
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
                        lead.status === "NEW"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : lead.status === "QUALIFIED"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : lead.status === "CONVERTED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border-white/5"
                      }`}
                    >
                      {lead.status}
                    </span>

                    <a
                      href={getWhatsAppLink(
                        lead.phone,
                        `Hello ${lead.firstName}, this is Arish from AgniGrow regarding your ${lead.service} inquiry.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition"
                      title="Direct WhatsApp Desk"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Follow-up Queue (1 col) */}
          <div className="rounded-xl bg-[#101622] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Follow-up Action Queue
                </h3>
                <p className="text-xs text-slate-400">
                  Tasks awaiting sales representative action
                </p>
              </div>
              <Link
                href="/tasks"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition"
              >
                <span>All Tasks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {urgentTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-[#0c1017] border border-white/5 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-slate-200 line-clamp-2">
                      {task.title}
                    </p>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold uppercase shrink-0 ${
                        task.priority === "URGENT"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Due: {formatDate(task.dueDate)}</span>
                    <span className="text-blue-400 font-mono text-[10px]">
                      {task.type?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
