import { prisma } from "@/lib/prisma";
import { DonationInput } from "@/schemas/donations.schema";
import { randomUUID } from "crypto";

type DistributionStatus = "Pending" | "Distributed";

type DonorDashboardDistribution = {
  id: string;
  date: string;
  programName: string;
  amount: number;
  status: DistributionStatus;
};

const QUICK_SELECT_AMOUNTS = [1000000, 5000000, 10000000];

const rankFromTotalDonation = (totalDonation: number) => {
  if (totalDonation >= 50000000) return "Platinum Donor";
  if (totalDonation >= 20000000) return "Gold Donor";
  if (totalDonation >= 5000000) return "Silver Donor";
  return "Bronze Donor";
};

const mapDistributionStatus = (amount: number, remaining: number): DistributionStatus => {
  return remaining >= amount ? "Pending" : "Distributed";
};

export const DonationService = {
  async createDonation(userId: string, data: DonationInput) {
    return await prisma.$transaction(async (tx) => {
      const donorFund = await tx.donorFund.create({
        data: {
          donorId: userId,
          amount: data.amount,
          remaining: data.amount,
        },
      });

      const payment = await tx.paymentTransaction.create({
        data: {
          externalId: `DON-${Date.now()}-${randomUUID().slice(0, 5)}`,
          referenceDonorFund: donorFund.id,
          category: "DONATION",
          amount: data.amount,
          paymentType: data.paymentType,
          status: "PENDING",
          response: {},
        },
      });

      return { donorFund, payment };
    });
  },

  async getDonations() {
    try {
      const donations = await prisma.donorFund.findMany({
        where: {
          // Only fetch funds that still have money available to allocate
          remaining: {
            gt: 0,
          },
        },
        select: {
          id: true,
          amount: true,
          remaining: true,
          // Fetches the User who owns this fund
          donor: {
            select: {
              name: true,
              image: true,
            },
          },
          // Fetches transaction details to identify the "fund type"
          paymentTransaction: {
            select: {
              paymentType: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // We map the data so the frontend receives a clean, flattened object
      const formattedDonations = donations.map((d) => ({
        id: d.id,
        name: d.donor.name,
        image: d.donor.image,
        available: Number(d.remaining), // Convert Prisma Decimal to Number
        totalAmount: Number(d.amount),
        fund: d.paymentTransaction?.paymentType || "Donasi Umum",
      }));

      return {
        donations: formattedDonations,
      };
    } catch (error) {
      console.error("Error fetching donor funds:", error);
      throw new Error("Gagal mengambil data dana donor.");
    }
  },

  async getDonorDashboard() {
    try {
      const donorFunds = await prisma.donorFund.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          amount: true,
          remaining: true,
          createdAt: true,
          loanFundings: {
            select: {
              id: true,
            },
          },
          paymentTransaction: {
            select: {
              paymentType: true,
            },
          },
        },
        take: 50,
      });

      const summarySeed = donorFunds.reduce(
        (acc, fund) => {
          const amount = Number(fund.amount);
          const remaining = Number(fund.remaining);
          const allocated = Math.max(amount - remaining, 0);

          acc.totalDonated += amount;
          acc.totalAllocated += allocated;

          if (allocated > 0 || fund.loanFundings.length > 0) {
            acc.activeImpact += 1;
          }

          return acc;
        },
        {
          totalDonated: 0,
          totalAllocated: 0,
          activeImpact: 0,
        }
      );

      const recentDistributions: DonorDashboardDistribution[] = donorFunds
        .slice(0, 5)
        .map((fund) => {
          const amount = Number(fund.amount);
          const remaining = Number(fund.remaining);
          const status = mapDistributionStatus(amount, remaining);
          const distributionAmount = status === "Distributed" ? Math.max(amount - remaining, 0) : amount;

          return {
            id: fund.id,
            date: fund.createdAt.toISOString(),
            programName: fund.paymentTransaction?.paymentType
              ? `${fund.paymentTransaction.paymentType} Program`
              : "Student Support Program",
            amount: distributionAmount,
            status,
          };
        });

      return {
        summary: {
          totalDonated: summarySeed.totalDonated,
          activeImpact: summarySeed.activeImpact,
          currentRank: rankFromTotalDonation(summarySeed.totalDonated),
        },
        recentDistributions,
        quickSelectAmounts: QUICK_SELECT_AMOUNTS,
      };
    } catch (error) {
      console.error("Error fetching donor dashboard:", error);
      throw new Error("Gagal mengambil data dashboard donor.");
    }
  },
};