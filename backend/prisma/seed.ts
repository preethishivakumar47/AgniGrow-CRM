import { PrismaClient, Role, ServiceCategory, BudgetTier, TimelineTier, LeadStatus, DealStage } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AgniGrow CRM standalone backend database...");

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash("AgniAdmin@2026", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@agnigrow.in" },
    update: {},
    create: {
      email: "admin@agnigrow.in",
      name: "Arish Srinivasan",
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  // 2. Create Sample Sales Rep
  const repPasswordHash = await bcrypt.hash("RepAgni@2026", 10);
  const rep = await prisma.user.upsert({
    where: { email: "sales@agnigrow.in" },
    update: {},
    create: {
      email: "sales@agnigrow.in",
      name: "Karthik Sales Rep",
      passwordHash: repPasswordHash,
      role: Role.EMPLOYEE,
      isActive: true,
    },
  });

  // 3. Create Sample Inbound Leads
  await prisma.lead.create({
    data: {
      firstName: "Muthu",
      lastName: "Kumar",
      phone: "+919876543210",
      email: "muthu@amburleather.com",
      companyName: "Ambur Fine Leathers",
      service: ServiceCategory.WEBSITE,
      budget: BudgetTier.TIER_60K_120K,
      timeline: TimelineTier.WEEKS_2_TO_4,
      notes: "Requires export catalog with direct WhatsApp quotation button.",
      status: LeadStatus.NEW,
      assignedUserId: admin.id,
    },
  });

  await prisma.lead.create({
    data: {
      firstName: "Syed",
      lastName: "Ibrahim",
      phone: "+919443211223",
      email: "syed@vnbspices.com",
      companyName: "Vaniyambadi Spices Exporters",
      service: ServiceCategory.WHATSAPP_BOT,
      budget: BudgetTier.TIER_30K_60K,
      timeline: TimelineTier.UNDER_2_WEEKS,
      notes: "Inquiry via website scoper for automated quotation desk.",
      status: LeadStatus.CONTACTED,
      assignedUserId: rep.id,
    },
  });

  // 4. Create Sample Account, Contact & Deal
  const account = await prisma.account.create({
    data: {
      name: "Ranipet Global Leather Works",
      industry: "Leather Exports",
      city: "Ranipet",
      contacts: {
        create: {
          firstName: "Ramesh",
          lastName: "Krishnan",
          phone: "+919842155678",
          email: "ramesh@ranipetexports.in",
          designation: "Managing Partner",
          isPrimary: true,
        },
      },
    },
    include: { contacts: true },
  });

  await prisma.deal.create({
    data: {
      title: "Multilingual Export Portal & WhatsApp CRM Bot",
      accountId: account.id,
      contactId: account.contacts[0].id,
      assignedUserId: admin.id,
      service: ServiceCategory.WEBSITE,
      dealValue: 85000.0,
      stage: DealStage.PROPOSAL_SENT,
      probability: 60,
    },
  });

  console.log("✅ Standalone Backend Database Seed Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

