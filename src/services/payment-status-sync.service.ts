import type { PaymentTransaction } from '@/generated/prisma';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { createBusinessRecordFromSettledPayment } from '@/services/payment-fulfillment.service';
import { getTransactionStatus, mapMidtransStatus } from '@/services/midtrans.service';

export async function syncPaymentTransactionFromMidtrans(orderId: string) {
  const paymentTransaction = await prisma.paymentTransaction.findFirst({
    where: { externalId: orderId },
  });

  if (!paymentTransaction) {
    return {
      paymentTransaction: null,
      detail: null,
    };
  }

  const statusResult = await getTransactionStatus(orderId);
  const mappedStatus = mapMidtransStatus(statusResult.status);
  const finalStatus =
    paymentTransaction.status === 'SETTLEMENT' ? paymentTransaction.status : mappedStatus;

  const updatedTransaction = await prisma.paymentTransaction.update({
    where: { id: paymentTransaction.id },
    data: {
      status: finalStatus,
      response: statusResult.rawResponse as Prisma.InputJsonValue,
    },
  });

  if (finalStatus === 'SETTLEMENT') {
    await createBusinessRecordFromSettledPayment({
      ...paymentTransaction,
      status: finalStatus,
    } as PaymentTransaction);
  }

  return {
    paymentTransaction: updatedTransaction,
    detail: statusResult,
  };
}
