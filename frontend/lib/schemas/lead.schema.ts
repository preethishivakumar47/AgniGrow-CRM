import { z } from "zod";

export const CreateLeadSchema = z.object({
  firstName: z.string().min(2, "Name must be at least 2 characters").max(60),
  lastName: z.string().max(60).optional(),
  phone: z.string().regex(/^[0-9+ ]{10,16}$/, "Must be a valid 10-15 digit phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  companyName: z.string().max(100).optional(),
  service: z
    .enum([
      "WEBSITE",
      "ECOMMERCE",
      "WHATSAPP_BOT",
      "BRANDING",
      "ERP_POS",
      "EVENT_MICROSITE",
      "OTHER",
    ])
    .default("WEBSITE"),
  budget: z
    .enum([
      "TIER_15K_30K",
      "TIER_30K_60K",
      "TIER_60K_120K",
      "TIER_120K_PLUS",
      "DISCUSS",
    ])
    .default("TIER_30K_60K"),
  timeline: z
    .enum(["UNDER_2_WEEKS", "WEEKS_2_TO_4", "MONTHS_1_TO_2", "FLEXIBLE"])
    .default("WEEKS_2_TO_4"),
  notes: z.string().max(2000).optional(),
  source: z
    .enum([
      "WEBSITE_SCOPER",
      "WHATSAPP_DIRECT",
      "PHONE_INQUIRY",
      "REFERRAL",
      "MANUAL",
    ])
    .default("MANUAL"),
});

export const ConvertLeadSchema = z.object({
  leadId: z.string().uuid(),
  accountName: z.string().min(2, "Company name is required").max(100),
  industry: z.string().optional(),
  dealTitle: z.string().min(3, "Deal title is required").max(120),
  dealValue: z.number().nonnegative("Value must be a positive number"),
  expectedCloseDate: z.string().optional(),
  assignedUserId: z.string().uuid("Assigned user is required"),
});

