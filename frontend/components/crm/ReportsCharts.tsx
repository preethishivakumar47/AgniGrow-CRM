"use client";

import { formatINR } from "@/lib/formatters";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { TrendingUp, Award, Target, Flame } from "lucide-react";

interface ReportsData {
  serviceBreakdown: Array<{ name: string; value: number; count: number }>;
  stageDistribution: Array<{ stage: string; totalValue: number; count: number }>;
  metrics: {
    totalRevenueWon: number;
    totalPipeline: number;
    winRate: string;
    avgDealSize: number;
  };
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899"];

export function ReportsCharts({ data }: { data: ReportsData }) {
  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#101622] border border-white/10 space-y-2">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">CLOSED WON REVENUE</p>
          <p className="text-2xl font-bold tracking-tight text-emerald-400">{formatINR(data.metrics.totalRevenueWon)}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Realized agency income</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#101622] border border-white/10 space-y-2">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">ACTIVE PIPELINE VALUE</p>
          <p className="text-2xl font-bold tracking-tight text-blue-400">{formatINR(data.metrics.totalPipeline)}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <Flame className="w-3.5 h-3.5 text-blue-400" />
            <span>Opportunities in flight</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#101622] border border-white/10 space-y-2">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">DEAL CONVERSION RATIO</p>
          <p className="text-2xl font-bold tracking-tight text-amber-400">{data.metrics.winRate}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Lead to Won transition</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#101622] border border-white/10 space-y-2">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">AVERAGE DEAL TICKET</p>
          <p className="text-2xl font-bold tracking-tight text-slate-100">{formatINR(data.metrics.avgDealSize)}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <TrendingUp className="w-3.5 h-3.5 text-slate-300" />
            <span>Average contract value</span>
          </div>
        </div>
      </div>

      {/* Two Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Revenue Distribution */}
        <div className="p-6 rounded-xl bg-[#101622] border border-white/10 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Revenue by Service Category</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown across Web Portals, WhatsApp Bots, E-Commerce and Brand kits
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.serviceBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(val), "Value"]}
                  contentStyle={{ backgroundColor: "#0b0f17", borderColor: "rgba(255,255,255,0.15)", borderRadius: "8px", fontSize: "12px", color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: 600 }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Stage Distribution */}
        <div className="p-6 rounded-xl bg-[#101622] border border-white/10 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Pipeline Funnel Value by Stage</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Commercial weighting across Discovery, Proposal and Won
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {data.stageDistribution.map((item, idx) => (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{item.stage.replace(/_/g, " ")}</span>
                  <span className="font-medium text-slate-300">{formatINR(item.totalValue)} <span className="text-slate-500 font-normal">({item.count} deals)</span></span>
                </div>
                <div className="h-2 rounded-full bg-[#162032] overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.min(100, Math.max(10, (item.totalValue / (data.metrics.totalPipeline + data.metrics.totalRevenueWon || 1)) * 100))}%`,
                      backgroundColor: COLORS[idx % COLORS.length]
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
