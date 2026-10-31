/**
 * AgniGrow CRM - Standalone Backend REST API Client
 * Exclusively connects Next.js Frontend to Express Backend at http://localhost:5000/api/v1
 */

const API_BASE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T = any>(
  path: string, 
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers = {}, ...rest } = options;

  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...headers,
      },
      ...rest,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `Backend API Error: ${res.status} ${res.statusText}`);
    }

    return data as T;
  } catch (err: any) {
    throw new Error(err.message || "Failed to communicate with AgniGrow CRM Backend");
  }
}

export const apiClient = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest<{ success: boolean; data: { token: string; user: any } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    me: (token?: string) => apiRequest("/auth/me", { token }),
  },

  // Leads
  leads: {
    list: (params?: Record<string, string>, token?: string) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return apiRequest<{ success: boolean; data: any[] }>(`/leads${query}`, { token });
    },
    get: (id: string, token?: string) => apiRequest<{ success: boolean; data: any }>(`/leads/${id}`, { token }),
    create: (lead: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>("/leads", {
        method: "POST",
        body: JSON.stringify(lead),
        token,
      }),
    update: (id: string, updates: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>(`/leads/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
        token,
      }),
    convert: (id: string, payload: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>(`/leads/${id}/convert`, {
        method: "POST",
        body: JSON.stringify(payload),
        token,
      }),
    delete: (id: string, token?: string) =>
      apiRequest<{ success: boolean; message: string }>(`/leads/${id}`, { method: "DELETE", token }),
  },

  // Deals
  deals: {
    list: (params?: Record<string, string>, token?: string) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return apiRequest<{ success: boolean; data: any[] }>(`/deals${query}`, { token });
    },
    get: (id: string, token?: string) => apiRequest<{ success: boolean; data: any }>(`/deals/${id}`, { token }),
    create: (deal: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>("/deals", {
        method: "POST",
        body: JSON.stringify(deal),
        token,
      }),
    updateStage: (id: string, stage: string, lostReason?: string, token?: string) =>
      apiRequest<{ success: boolean; data: any }>(`/deals/${id}/stage`, {
        method: "PATCH",
        body: JSON.stringify({ stage, lostReason }),
        token,
      }),
    delete: (id: string, token?: string) =>
      apiRequest<{ success: boolean; message: string }>(`/deals/${id}`, { method: "DELETE", token }),
  },

  // Contacts
  contacts: {
    list: (token?: string) => apiRequest<{ success: boolean; data: any[] }>("/contacts", { token }),
    create: (data: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>("/contacts", { method: "POST", body: JSON.stringify(data), token }),
    delete: (id: string, token?: string) =>
      apiRequest<{ success: boolean; message: string }>(`/contacts/${id}`, { method: "DELETE", token }),
  },

  // Accounts
  accounts: {
    list: (token?: string) => apiRequest<{ success: boolean; data: any[] }>("/accounts", { token }),
    create: (data: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>("/accounts", { method: "POST", body: JSON.stringify(data), token }),
    delete: (id: string, token?: string) =>
      apiRequest<{ success: boolean; message: string }>(`/accounts/${id}`, { method: "DELETE", token }),
  },

  // Tasks
  tasks: {
    list: (token?: string) => apiRequest<{ success: boolean; data: any[] }>("/tasks", { token }),
    create: (data: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>("/tasks", { method: "POST", body: JSON.stringify(data), token }),
    toggle: (id: string, isCompleted?: boolean, token?: string) =>
      apiRequest<{ success: boolean; data: any }>(`/tasks/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isCompleted }),
        token,
      }),
  },

  // Quotes
  quotes: {
    list: (token?: string) => apiRequest<{ success: boolean; data: any[] }>("/quotes", { token }),
    create: (data: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>("/quotes", { method: "POST", body: JSON.stringify(data), token }),
    accept: (id: string, token?: string) =>
      apiRequest<{ success: boolean; data: any }>(`/quotes/${id}/accept`, { method: "PATCH", token }),
  },

  // Team
  team: {
    list: (token?: string) => apiRequest<{ success: boolean; data: any[] }>("/team", { token }),
    create: (data: any, token?: string) =>
      apiRequest<{ success: boolean; data: any }>("/team", { method: "POST", body: JSON.stringify(data), token }),
    toggleStatus: (id: string, token?: string) =>
      apiRequest<{ success: boolean; data: any }>(`/team/${id}/status`, { method: "PATCH", token }),
  },

  // Analytics
  analytics: {
    dashboard: (token?: string) => apiRequest<{ success: boolean; data: any }>("/analytics/dashboard", { token }),
    reports: (token?: string) => apiRequest<{ success: boolean; data: any }>("/analytics/reports", { token }),
  },
};
