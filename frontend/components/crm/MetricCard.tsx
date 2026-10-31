import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  trend?: "up" | "neutral" | "urgent";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  trend,
}: MetricCardProps) {
  return (
    <div className="p-4 rounded-xl bg-[#0f1420] border border-slate-800/80 hover:border-slate-700/90 transition shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-400 font-mono tracking-wider uppercase">
          {title}
        </span>
        <div className="p-1.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/50">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold tracking-tight text-slate-100 font-mono">
          {value}
        </div>
        {(subtitle || badge) && (
          <div className="flex items-center gap-2 text-xs pt-1">
            {badge && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono ${
                  trend === "urgent"
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {badge}
              </span>
            )}
            {subtitle && <span className="text-[11px] text-slate-400 truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
