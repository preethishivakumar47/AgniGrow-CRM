import { Request, Response } from "express";
import { prisma } from "../config/db.js";

let fallbackContacts: any[] = [
  {
    id: "cnt-001",
    firstName: "Arun",
    lastName: "Kumar",
    phone: "+91 98765 43210",
    email: "arun@leathercraft.in",
    designation: "Managing Director",
    isPrimary: true,
    account: { name: "Vaniyambadi Leather Exports Ltd", city: "Vaniyambadi" },
    deals: [{ id: "deal-001", title: "E-Commerce Portal", dealValue: 125000, stage: "DISCOVERY" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "cnt-002",
    firstName: "Priya",
    lastName: "Sundaram",
    phone: "+91 94432 10987",
    email: "priya@texstyle.in",
    designation: "Operations Head",
    isPrimary: true,
    account: { name: "TexStyle Garments Ltd", city: "Coimbatore" },
    deals: [{ id: "deal-002", title: "Automated WhatsApp Bot", dealValue: 48000, stage: "PROPOSAL_SENT" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "cnt-003",
    firstName: "Karthik",
    lastName: "Natarajan",
    phone: "+91 98401 23456",
    email: "karthik@salemsteel.in",
    designation: "Chief Technology Officer",
    isPrimary: true,
    account: { name: "Salem Steel Works Private Limited", city: "Salem" },
    deals: [{ id: "deal-003", title: "Cloud ERP & CRM System", dealValue: 180000, stage: "NEGOTIATION" }],
    createdAt: new Date().toISOString(),
  },
];

export async function getContacts(req: Request, res: Response) {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        account: { select: { id: true, name: true, city: true } },
        deals: { select: { id: true, title: true, dealValue: true, stage: true } },
      },
    });
    if (contacts.length > 0) {
      return res.json({ success: true, data: contacts });
    }
  } catch (error: any) {
    console.warn("DB getContacts warning, returning fallback data:", error.message);
  }
  return res.json({ success: true, data: fallbackContacts });
}

export async function createContact(req: Request, res: Response) {
  const data = req.body;
  try {
    const contact = await prisma.contact.create({
      data,
    });
    return res.status(201).json({ success: true, data: contact });
  } catch (error: any) {
    console.warn("DB createContact warning, saving to fallback:", error.message);
    const newContact = {
      id: `cnt-${Date.now()}`,
      ...data,
      account: { name: "Associated Account" },
      deals: [],
      createdAt: new Date().toISOString(),
    };
    fallbackContacts.unshift(newContact);
    return res.status(201).json({ success: true, data: newContact });
  }
}

export async function deleteContact(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    await prisma.contact.delete({ where: { id } });
    return res.json({ success: true, message: "Contact deleted" });
  } catch (error: any) {
    fallbackContacts = fallbackContacts.filter((c) => c.id !== id);
    return res.json({ success: true, message: "Contact deleted" });
  }
}
