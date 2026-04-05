import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  /*
  =====================
  ROLES
  =====================
  */
  // Roles must match ROLES constants in src/lib/roles.ts
  const adminRole = await prisma.role.create({
    data: {
      id: crypto.randomUUID(),
      name: "ADMIN",
    },
  });

  const donorRole = await prisma.role.create({
    data: {
      id: crypto.randomUUID(),
      name: "DONOR",
    },
  });

  const borrowerRole = await prisma.role.create({
    data: {
      id: crypto.randomUUID(),
      name: "BORROWER",
    },
  });

  /*
  =====================
  USERS
  =====================
  */

  const admin = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: "Admin",
      email: "admin@example.com",
      password: password,
    },
  });

  const donor = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: "Donor User",
      email: "donor@example.com",
      password: password,
    },
  });

  const borrower = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: "Borrower User",
      email: "borrower@example.com",
      password: password,
    },
  });

  /*
  =====================
  USER ROLES
  =====================
  */

  await prisma.userRole.createMany({
    data: [
      {
        userId: admin.id,
        roleId: adminRole.id,
      },
      {
        userId: donor.id,
        roleId: donorRole.id,
      },
      {
        userId: borrower.id,
        roleId: borrowerRole.id,
      },
    ],
  });

  /*
  =====================
  DONOR FUND
  =====================
  */

  const donorFund = await prisma.donorFund.create({
    data: {
      id: crypto.randomUUID(),
      donorId: donor.id,
      amount: 1000,
      remaining: 1000,
    },
  });

  /*
  =====================
  LOAN APPLICATION
  =====================
  */

  const application = await prisma.loanApplication.create({
    data: {
      id: crypto.randomUUID(),
      borrowerId: borrower.id,
      requestedAmount: 500,
      description: "Small business capital",
      collateralUrl: "https://example.com/collateral.jpg",
      collateralDescription: "Motorcycle BPKB",
    },
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
