import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import type { CreateLoanFundingInput } from "@/schemas/loan-funding.schema";
import { NotificationService } from "@/services/notification.service";

function toDecimal(amount: number) {
  return new Prisma.Decimal(amount);
}

function decimalToNumber(value: Prisma.Decimal) {
  return value.toNumber();
}

export const LoanFundingService = {
  async allocateDonorFund(input: CreateLoanFundingInput) {
    const amount = toDecimal(input.amount);

    return prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({
        where: { id: input.loanId },
        include: {
          application: {
            select: {
              borrowerId: true,
            },
          },
          fundings: {
            select: {
              amount: true,
            },
          },
        },
      });

      if (!loan) {
        throw new Error("LOAN_NOT_FOUND");
      }

      const donorFund = await tx.donorFund.findUnique({
        where: { id: input.donorFundId },
        select: {
          id: true,
          donorId: true,
          remaining: true,
        },
      });

      if (!donorFund) {
        throw new Error("DONOR_FUND_NOT_FOUND");
      }

      if (donorFund.remaining.lessThan(amount)) {
        throw new Error("INSUFFICIENT_DONOR_FUND");
      }

      const allocatedAmount = loan.fundings.reduce(
        (total, funding) => total.plus(funding.amount),
        new Prisma.Decimal(0)
      );
      const loanRemaining = loan.approvedAmount.minus(allocatedAmount);

      if (loanRemaining.lessThan(amount)) {
        throw new Error("LOAN_OVER_ALLOCATION");
      }

      const donorFundUpdate = await tx.donorFund.updateMany({
        where: {
          id: input.donorFundId,
          remaining: {
            gte: amount,
          },
        },
        data: {
          remaining: {
            decrement: amount,
          },
        },
      });

      if (donorFundUpdate.count !== 1) {
        throw new Error("INSUFFICIENT_DONOR_FUND");
      }

      const loanFunding = await tx.loanFunding.create({
        data: {
          loanId: input.loanId,
          donorFundId: input.donorFundId,
          sourceType: "DONOR",
          amount,
        },
      });

      await NotificationService.createLoanFundingNotifications(
        {
          borrowerId: loan.application.borrowerId,
          donorId: donorFund.donorId,
          loanId: input.loanId,
          amount: input.amount,
        },
        tx
      );

      return {
        id: loanFunding.id,
        loanId: loanFunding.loanId,
        donorFundId: loanFunding.donorFundId,
        sourceType: loanFunding.sourceType,
        amount: decimalToNumber(loanFunding.amount),
        remainingDonorFund: decimalToNumber(donorFund.remaining.minus(amount)),
        remainingLoanAmount: decimalToNumber(loanRemaining.minus(amount)),
      };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  },
};
