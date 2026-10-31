"use server";

import { apiClient } from "@/lib/api-client";
import { createSessionCookie, clearSessionCookie, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const res = await apiClient.auth.login({ email, password });
    if (res.success && res.data?.user) {
      await createSessionCookie({
        id: res.data.user.id,
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role,
      });
      redirect("/dashboard");
    }
  } catch (err: any) {
    console.warn("Backend API login attempt notice:", err.message);
  }

  // Development & Demo Fallback credentials
  if (email === "admin@agnigrow.in" && password === "AgniAdmin@2026") {
    await createSessionCookie({
      id: "admin-demo-uuid",
      email: "admin@agnigrow.in",
      name: "Arish Srinivasan",
      role: "ADMIN",
    });
    redirect("/dashboard");
  }

  return { error: "Invalid email or password. Use demo: admin@agnigrow.in / AgniAdmin@2026" };
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

export async function getCurrentUser() {
  return await getSession();
}
