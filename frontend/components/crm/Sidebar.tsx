"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  CheckSquare, 
  LogOut, 
  PhoneCall, 
  Building2, 
  Contact, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  Zap, 
  Layers 
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth-actions";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const navSections = [
  {
    title: "PIPELINE & SALES",
    items: [
      { href: "/dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
      { href: "/leads", label: "Inbound Leads", icon: Users, badge: "New" },
      { href: "/pipeline", label: "Deals Kanban", icon: Kanban },
      { href: "/tasks", label: "Follow-Up Queue", icon: CheckSquare },
    ],
  },
  {
    title: "DIRECTORY & ASSETS",
    items: [
      { href: "/contacts", label: "Contacts Rolodex", icon: Contact },
      { href: "/accounts", label: "Company Accounts", icon: Building2 },
      { href: "/quotes", label: "Proposals & Quotes", icon: FileText },
    ],
  },
  {
    title: "MANAGEMENT & GOVERNANCE",
    items: [
      { href: "/reports", label: "Revenue Analytics", icon: BarChart3 },
      { href: "/settings", label: "Agency & Team", icon: Settings },
    ],
  },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0b0f17] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div className="flex-1 overflow-y-auto">
        {/* Workspace Brand Switcher */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#0b0f17]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-sm shadow-orange-500/20">
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5 tracking-tight">
                AgniGrow Agency
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Workspace HQ • IN</div>
            </div>
          </div>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            LIVE
          </span>
        </div>

        {/* Navigation Groups */}
        <div className="p-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2.5 text-[10px] font-semibold tracking-wider text-slate-400 font-mono">
                {section.title}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-800 text-white font-semibold shadow-xs border-l-2 border-orange-500 pl-2"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-orange-400" : "text-slate-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer User Section */}
      <div className="p-3 border-t border-slate-800/80 bg-[#090d14] space-y-2.5">
        <a
          href="https://wa.me/917200146914"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition group"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-slate-300 group-hover:text-white font-medium">WhatsApp Desk</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">+91 7200146914</span>
        </a>

        {user && (
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                {user.name[0]}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate font-mono">{user.role}</p>
              </div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Log out"
                className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}
