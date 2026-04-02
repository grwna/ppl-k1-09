import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";
import bcrypt from "bcryptjs";
import type { RegisterInput } from "@/schemas/auth.schema";

export const UserService = {
  /**
   * Registers a new user with a hashed password and an assigned role.
   * Throws "EMAIL_TAKEN" if the email already exists.
   */
  async register(data: RegisterInput) {
    const { name, email, password, role } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("EMAIL_TAKEN");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const selectedRole = role || ROLES.DONOR;

    const newUser = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        roles: {
          create: {
            role: {
              connectOrCreate: {
                where: { name: selectedRole },
                create: { name: selectedRole },
              },
            },
          },
        },
      },
      omit: { password: true },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    return newUser;
  },

  /**
   * Verifies email/password credentials.
   * Returns the user payload (id, name, email, roles) on success, or null on failure.
   * Safe to call directly from NextAuth authorize() — no HTTP round-trip needed.
   */
  async verifyCredentials(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user || !user.password) return null;

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((ur) => ur.role.name),
    };
  },
};
