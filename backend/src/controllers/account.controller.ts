import { Request, Response } from "express";
import { prisma } from "../config/db.js";

let fallbackAccounts: any[] = [
  {
    id: "acc-001",
    name: "Vaniyambadi Leather Exports Ltd",
    industry: "MANUFACTURING",
    website: "https://vanyaleather.in",
    city: "Vaniyambadi",
    state: "Tamil Nadu",
    contacts: [{ id: "c-1", firstName: "Arun", lastName: "Kumar", phone: "+91 98765 43210" }],
    deals: [{ id: "d-1", title: "E-Commerce Portal", dealValue: 125000, stage: "DISCOVERY" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc-002",
    name: "TexStyle Garments Ltd",
    industry: "TEXTILES",
    website: "https://texstylegarments.com",
    city: "Coimbatore",
    state: "Tamil Nadu",
    contacts: [{ id: "c-2", firstName: "Priya", lastName: "Sundaram", phone: "+91 94432 10987" }],
    deals: [{ id: "d-2", title: "Automated WhatsApp Bot", dealValue: 48000, stage: "PROPOSAL_SENT" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc-003",
    name: "Salem Steel Works Private Limited",
    industry: "INDUSTRIAL",
    city: "Salem",
    state: "Tamil Nadu",
    contacts: [{ id: "c-3", firstName: "Karthik", lastName: "Natarajan", phone: "+91 98401 23456" }],
    deals: [{ id: "d-3", title: "Cloud ERP & CRM System", dealValue: 180000, stage: "NEGOTIATION" }],
    createdAt: new Date().toISOString(),
  },
];

export async function getAccounts(req: Request, res: Response) {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contacts: true,
        deals: { select: { id: true, title: true, dealValue: true, stage: true } },
      },
    });
    if (accounts.length > 0) {
      return res.json({ success: true, data: accounts });
    }
  } catch (error: any) {
    console.warn("DB getAccounts warning, returning fallback data:", error.message);
  }
  return res.json({ success: true, data: fallbackAccounts });
}

export async function createAccount(req: Request, res: Response) {
  const data = req.body;
  try {
    const account = await prisma.account.create({
      data,
    });
    return res.status(201).json({ success: true, data: account });
  } catch (error: any) {
    console.warn("DB createAccount warning, saving to fallback:", error.message);
    const newAcc = {
      id: `acc-${Date.now()}`,
      ...data,
      contacts: [],
      deals: [],
      createdAt: new Date().toISOString(),
    };
    fallbackAccounts.unshift(newAcc);
    return res.status(201).json({ success: true, data: newAcc });
  }
}

export async function deleteAccount(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    await prisma.account.delete({ where: { id } });
    return res.json({ success: true, message: "Account deleted" });
  } catch (error: any) {
    fallbackAccounts = fallbackAccounts.filter((a) => a.id !== id);
    return res.json({ success: true, message: "Account deleted" });
  }
}
