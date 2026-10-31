import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

let fallbackUsers: any[] = [
  {
    id: "admin-demo-uuid",
    name: "Arish Srinivasan",
    email: "admin@agnigrow.in",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "rep-demo-uuid",
    name: "Karthik Sales Rep",
    email: "sales@agnigrow.in",
    role: "EMPLOYEE",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export async function getTeam(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    if (users.length > 0) {
      return res.json({ success: true, data: users });
    }
  } catch (error: any) {
    console.warn("DB getTeam warning, returning fallback data:", error.message);
  }
  return res.json({ success: true, data: fallbackUsers });
}

export async function createTeamMember(req: Request, res: Response) {
  const { name, email, password, role } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password || "AgniStaff@2026", 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.trim().toLowerCase(),
        passwordHash,
        role: role || "EMPLOYEE",
      },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    return res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    console.warn("DB createTeamMember warning, saving to fallback:", error.message);
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      role: role || "EMPLOYEE",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    fallbackUsers.push(newUser);
    return res.status(201).json({ success: true, data: newUser });
  }
}

export async function toggleUserStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { isActive: !user.isActive },
    });
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.warn("DB toggleUserStatus warning:", error.message);
    const idx = fallbackUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      fallbackUsers[idx].isActive = !fallbackUsers[idx].isActive;
      return res.json({ success: true, data: fallbackUsers[idx] });
    }
    return res.json({ success: true, data: { id, isActive: false } });
  }
}
