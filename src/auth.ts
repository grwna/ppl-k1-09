import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * AUTH.JS CONFIGURATION TEMPLATE
 * This file centralizes all authentication logic for the app.
 * It uses the Prisma adapter to store user/session data in your database.
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Use JWT for easier scalability
  providers: [
    // 1. Social Provider (Example: Google)
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    
    // 2. Credentials Provider (Example: Email/Password)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add your logic to find the user and verify password here
        // Example:
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // if (user && verifyPassword(user, credentials.password)) return user;
        
        console.log("Auth: Authorizing user with credentials:", credentials.email);
        return null; // For dummy template
      },
    }),
  ],
  callbacks: {
    // Customize session or token here
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
    error: "/auth/error", // Custom error page
  },
});
