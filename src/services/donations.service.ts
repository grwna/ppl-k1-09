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
};