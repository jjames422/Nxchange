// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Received credentials:", credentials);

        try {
          await prisma.$connect();
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("User found:", user);

          if (user && bcrypt.compareSync(credentials.password, user.passwordHash)) {
            console.log("Password match successful");
            return { id: user.id, email: user.email, name: user.name };
          } else {
            console.log("Invalid credentials");
            return null;
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
  },
};

export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);
