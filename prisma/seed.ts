import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminRole = await prisma.role.create({
    data: { name: "ADMIN" },
  });

  const donorRole = await prisma.role.create({
    data: { name: "DONOR" },
  });

  const borrowerRole = await prisma.role.create({
    data: { name: "BORROWER" },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
    },
  });

  const donor = await prisma.user.create({
    data: {
      name: "Donor Satu",
      email: "donor@example.com",
      password: "donor123",
    },
  });

  const borrower = await prisma.user.create({
    data: {
      name: "Peminjam Satu",
      email: "borrower@example.com",
      password: "borrower123",
    },
  });

  await prisma.userRole.createMany({
    data: [
      { userId: admin.id, roleId: adminRole.id },
      { userId: donor.id, roleId: donorRole.id },
      { userId: borrower.id, roleId: borrowerRole.id },
    ],
  });

  const donorFund = await prisma.donorFund.create({
    data: {
      donorId: donor.id,
      amount: 10000000,
      remaining: 10000000,
    },
  });

  // const investorFund = await prisma.investorFund.create({
  //   data: {
  //     sourceName: "Investor Awal",
  //     totalAmount: 2000000000,
  //     remaining: 2000000000,
  //   },
  // });

  const application = await prisma.loanApplication.create({
    data: {
      borrowerId: borrower.id,
      requestedAmount: 5000000,
      description: "Modal usaha warung makan",
      collateralUrl: "https://example-r2/collateral/jaminan1.jpg",
      collateralDescription: "BPKB Motor Honda 2018",
    },
  });

  const loan = await prisma.loan.create({
    data: {
      applicationId: application.id,
      approvedAmount: 5000000,
      status: "ACTIVE",
      approvedAt: new Date(),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    },
  });

  await prisma.loanFunding.createMany({
    data: [
      {
        loanId: loan.id,
        sourceType: "DONOR",
        donorFundId: donorFund.id,
        amount: 2000000,
      },
      // {
      //   loanId: loan.id,
      //   sourceType: "INVESTOR",
      //   investorFundId: investorFund.id,
      //   amount: 3000000,
      // },
    ],
  });

  await prisma.repayment.create({
    data: {
      loanId: loan.id,
      amount: 1000000,
      paidAt: new Date(),
      status: "CONFIRMED",
    },
  });

  console.log("Seed data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
