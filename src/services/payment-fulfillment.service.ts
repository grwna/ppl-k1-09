import { prisma } from '@/lib/prisma';
import { TransactionCategory, type PaymentTransaction } from '@/generated/prisma';

export async function createBusinessRecordFromSettledPayment(paymentTransaction: PaymentTransaction) {
  if (paymentTransaction.status !== 'SETTLEMENT') {
    return;
  }

  if (paymentTransaction.category === TransactionCategory.DONATION) {
    const existingDonorFund = await prisma.donorFund.findUnique({
      where: { paymentTransactionId: paymentTransaction.id },
    });

    if (!existingDonorFund) {
      await prisma.donorFund.create({
        data: {
          donorId: paymentTransaction.referenceId,
          paymentTransactionId: paymentTransaction.id,
          amount: paymentTransaction.amount,
          remaining: paymentTransaction.amount,
        },
      });
    }

    return;
  }

  if (paymentTransaction.category === TransactionCategory.REPAYMENT) {
    const existingRepayment = await prisma.repayment.findUnique({
      where: { paymentTransactionId: paymentTransaction.id },
    });

    if (!existingRepayment) {
      await prisma.repayment.create({
        data: {
          loanId: paymentTransaction.referenceId,
          paymentTransactionId: paymentTransaction.id,
          amount: paymentTransaction.amount,
          paidAt: new Date(),
          status: 'CONFIRMED',
        },
      });
      return;
    }

    if (existingRepayment.status !== 'CONFIRMED') {
      await prisma.repayment.update({
        where: { id: existingRepayment.id },
        data: { status: 'CONFIRMED' },
      });
    }
  }
}
