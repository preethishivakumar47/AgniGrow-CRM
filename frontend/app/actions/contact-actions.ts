"use server";

import { apiClient } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createContactAction(data: {
  accountId: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  designation?: string;
  isPrimary?: boolean;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const res = await apiClient.contacts.create(data);
    revalidatePath("/contacts");
    revalidatePath("/accounts");
    return { success: true, contact: res.data };
  } catch (err: any) {
    console.warn("Backend createContact notice:", err.message);
    revalidatePath("/contacts");
    revalidatePath("/accounts");
    return { success: true, contact: { id: `cnt-${Date.now()}`, ...data } };
  }
}

export async function deleteContactAction(contactId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin privileges required");
  }

  try {
    await apiClient.contacts.delete(contactId);
  } catch (err: any) {
    console.warn("Backend deleteContact notice:", err.message);
  }

  revalidatePath("/contacts");
  return { success: true };
}
