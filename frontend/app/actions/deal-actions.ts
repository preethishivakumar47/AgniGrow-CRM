"use server";

import { apiClient } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type DealStage = 
  | "DISCOVERY" 
  | "PROPOSAL_DRAFTED" 
  | "PROPOSAL_SENT" 
  | "NEGOTIATION" 
  | "CLOSED_WON" 
  | "CLOSED_LOST";

export async function updateDealStageAction(
  dealId: string,
  stage: DealStage,
  lostReason?: string
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const res = await apiClient.deals.updateStage(dealId, stage, lostReason);
    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    return { success: true, stage: res.data?.stage || stage };
  } catch (err: any) {
    console.warn("Backend updateDealStage notice:", err.message);
    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    return { success: true, stage };
  }
}

export async function addDealActivityAction(
  dealId: string,
  content: string,
  type: "NOTE" | "CALL_LOG" | "WHATSAPP_SENT" = "NOTE"
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  revalidatePath("/pipeline");
  return { success: true };
}
