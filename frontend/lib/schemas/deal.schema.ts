import { z } from "zod";

export const UpdateDealStageSchema = z.object({
  dealId: z.string().uuid(),
  stage: z.enum([
    "DISCOVERY",
    "PROPOSAL_DRAFTED",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "CLOSED_WON",
    "CLOSED_LOST",
  ]),
  probability: z.number().min(0).max(100).optional(),
  lostReason: z.string().min(3, "Mandatory reason required when marking deal lost").optional(),
});

