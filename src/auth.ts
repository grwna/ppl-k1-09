import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { UserService } from "@/services/user.service";
import { VerifySchema } from "@/schemas/auth.schema";

/**
 * Full Node.js auth setup.
 * The Credentials provider lives here (not in auth.config.ts) because
 * it depends on bcrypt and Prisma which are Node.js-only and would fail in Edge middleware.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = VerifySchema.safeParse(credentials);
        if (!parsed.success) return null;

        return await UserService.verifyCredentials(parsed.data.email, parsed.data.password);
      },
    }),
  ],
});
