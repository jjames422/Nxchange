import { prisma } from "@/lib/prisma";

export async function GET(req, res) {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Database connection failed" });
  }
}
