import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);
