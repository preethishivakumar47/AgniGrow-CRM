"use client";

import { useState } from "react";
import { 
  Building2, 
  Users, 
  Key, 
  Copy, 
  Check, 
  UserPlus, 
  Loader2 
} from "lucide-react";
import { createTeamMemberAction, toggleUserStatusAction } from "@/app/actions/team-actions";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
}

export function SettingsView({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [copied, setCopied] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const webhookSecret = "agni_wh_sec_2026_x87d6f54b2a";
  const webhookUrl = "http://localhost:5000/api/v1/leads/webhook";

  function copySnippet() {
    navigator.clipboard.writeText(
      `curl -X POST ${webhookUrl} \\\n  -H "Content-Type: application/json" \\\n  -H "x-agni-secret: ${webhookSecret}" \\\n  -d '{"firstName":"Client","lastName":"Rao","phone":"+919876543210","service":"WEBSITE","budget":75000}'`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as any;

    try {
      const res = await createTeamMemberAction({ name, email, password, role });
      if (res.user) {
        setUsers((prev) => [
          { ...res.user, isActive: true, createdAt: new Date() },
          ...prev,
        ]);
        setIsInviteOpen(false);
      }
    } catch (err: any) {
      alert(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(user: UserItem) {
    await toggleUserStatusAction(user.id, user.isActive);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Agency Identity Card */}
      <div className="p-6 rounded-xl bg-[#101622] border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">AgniGrow Agency Profile</h2>
            <p className="text-xs text-slate-400">
              Digital agency operating parameters and official customer touchpoints
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          <div className="p-3.5 rounded-lg bg-[#0c1017] border border-white/5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">OFFICIAL WHATSAPP DESK</span>
            <p className="text-xs font-semibold text-emerald-400 mt-1">+91 72001 46914</p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#0c1017] border border-white/5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">HEADQUARTERS</span>
            <p className="text-xs font-semibold text-slate-200 mt-1">Vaniyambadi, Tamil Nadu, India</p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#0c1017] border border-white/5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">AGENCY DOMAIN</span>
            <p className="text-xs font-semibold text-blue-400 mt-1">agnigrow.in</p>
          </div>
        </div>
      </div>

      {/* Website Scoper Webhook Integration */}
      <div className="p-6 rounded-xl bg-[#101622] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Website Scoper Webhook Security</h2>
              <p className="text-xs text-slate-400">
                Shared secret token for automated inbound lead ingestion from agnigrow.in
              </p>
            </div>
          </div>
          <button
            onClick={copySnippet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-200 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied cURL" : "Copy Ingest Payload"}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0c1017] font-mono text-xs text-slate-300 border border-white/5 overflow-x-auto space-y-1">
          <p><span className="text-blue-400 font-semibold">ENDPOINT:</span> POST /api/v1/leads/webhook</p>
          <p><span className="text-amber-400 font-semibold">AUTH_HEADER:</span> x-agni-secret: {webhookSecret}</p>
        </div>
      </div>

      {/* Team & Staff Roles */}
      <div className="p-6 rounded-xl bg-[#101622] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Internal Team & Role Governance</h2>
              <p className="text-xs text-slate-400">
                Manage sales reps, account managers and system administrators
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Staff User</span>
          </button>
        </div>

        {/* Staff Table */}
        <div className="divide-y divide-white/5 border-t border-white/10 pt-2">
          {users.map((u) => (
            <div key={u.id} className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-slate-200">{u.name}</span>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                    u.role === "ADMIN"
                      ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                      : "bg-slate-800 text-slate-300 border border-white/5"
                  }`}
                >
                  {u.role}
                </span>

                <button
                  onClick={() => handleToggleStatus(u)}
                  className={`text-[10px] px-2.5 py-0.5 rounded font-medium transition cursor-pointer ${
                    u.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                  }`}
                >
                  {u.isActive ? "ACTIVE" : "SUSPENDED"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-[#101622] border border-white/15 shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Add New Staff User</h3>
            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  required
                  name="name"
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-3 py-2 rounded-lg bg-[#0c1017] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Staff Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="anand@agnigrow.in"
                  className="w-full px-3 py-2 rounded-lg bg-[#0c1017] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Temporary Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  defaultValue="AgniStaff@2026"
                  className="w-full px-3 py-2 rounded-lg bg-[#0c1017] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Role Authority
                </label>
                <select
                  name="role"
                  defaultValue="EMPLOYEE"
                  className="w-full px-2.5 py-2 rounded-lg bg-[#0c1017] border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="EMPLOYEE">Sales Representative (Employee)</option>
                  <option value="ADMIN">Agency Administrator (Full Access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
