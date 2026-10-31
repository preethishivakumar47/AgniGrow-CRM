import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkConnection() {
  console.log("=========================================");
  console.log("🔍 AGNI GROW CRM - CONNECTION DIAGNOSTIC");
  console.log("=========================================");
  
  const rawUrl = process.env.DATABASE_URL || "";
  const maskedUrl = rawUrl.replace(/:([^:@]+)@/, ":****@");
  console.log(`📌 Configured DATABASE_URL: ${maskedUrl}`);
  console.log(`📌 Configured PORT: ${process.env.PORT || 5000}`);

  console.log("\n⏳ Testing Database Handshake...");
  try {
    await prisma.$connect();
    console.log("✅ Database Handshake Successful!");
    
    const dbInfo: any = await prisma.$queryRaw`SELECT current_database(), current_user, version();`;
    console.log("📊 Database Details:", dbInfo);

    // Check table counts
    const userCount = await prisma.user.count();
    const leadCount = await prisma.lead.count();
    const dealCount = await prisma.deal.count();
    console.log(`👥 Users in DB: ${userCount}`);
    console.log(`📋 Leads in DB: ${leadCount}`);
    console.log(`💼 Deals in DB: ${dealCount}`);
    
    console.log("\n🎉 Full Database Connection is 100% OPERATIONAL!");
  } catch (error: any) {
    console.error("\n❌ Database Connection Failed!");
    console.error(`Error Code: ${error.code || "N/A"}`);
    console.error(`Error Message:\n${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();

