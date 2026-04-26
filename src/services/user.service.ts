import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
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

  /**
   * Creates a password reset token for the given email and returns it.
   * Returns null if the email is not registered (caller should not reveal this).
   */
  async createPasswordResetToken(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    // Remove any existing token for this email
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    const token = randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    return token;
  },

  /**
   * Validates a reset token and returns the associated email, or null if invalid/expired.
   */
  async getEmailByResetToken(token: string) {
    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record) return null;
    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return null;
    }
    return record.identifier;
  },

  /**
   * Resets the user's password using a valid token.
   * Returns true on success, false if token is invalid/expired.
   */
  async resetPassword(token: string, newPassword: string) {
    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record || record.expires < new Date()) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: record.identifier },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return true;
  },
};
