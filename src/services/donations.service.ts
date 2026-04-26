import { prisma } from "@/lib/prisma";
import { DonationInput } from "@/schemas/donations.schema";
import { randomUUID } from "crypto";

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
  }
};