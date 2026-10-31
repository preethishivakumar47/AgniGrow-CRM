"use client";

import { useActionState } from "react";
import { Lock, Mail, ArrowRight, Loader2, Zap } from "lucide-react";
import { loginAction } from "@/app/actions/auth-actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#080b11] flex flex-col justify-center items-center p-4 relative select-none">
      {/* Subtle subtle top grid highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Brand Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm shadow-orange-500/20 mb-3">
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            AgniGrow CRM
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer Relationship & Operating System
          </p>
        </div>

        {/* Login Box */}
        <div className="p-6 rounded-xl bg-[#0f1420] border border-slate-800 shadow-xl space-y-4">
          <form action={formAction} className="space-y-3.5">
            {state?.error && (
              <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="email"
                  name="email"
                  defaultValue="admin@agnigrow.in"
                  placeholder="name@agnigrow.in"
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="password"
                  name="password"
                  defaultValue="AgniAdmin@2026"
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs shadow-xs transition active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-1"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Sign in to CRM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-400 space-y-1">
            <p>Demo Account:</p>
            <p className="font-mono text-slate-300 text-[10px]">
              admin@agnigrow.in • AgniAdmin@2026
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-6 font-mono">
          © 2026 AgniGrow. Vaniyambadi, Tamil Nadu.
        </p>
      </div>
    </div>
  );
}
