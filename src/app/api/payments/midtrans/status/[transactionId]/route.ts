import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { getTransactionStatus, mapMidtransStatus } from '@/services/midtrans.service';
import { createBusinessRecordFromSettledPayment } from '@/services/payment-fulfillment.service';

/**
 * GET /api/payments/midtrans/status/[transactionId]
 * transactionId is mapped to Midtrans order_id
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { externalId: transactionId },
    });

    const statusResult = await getTransactionStatus(transactionId);
    const mappedStatus = mapMidtransStatus(statusResult.status);
    const finalStatus =
      paymentTransaction?.status === 'SETTLEMENT' ? paymentTransaction.status : mappedStatus;

    if (paymentTransaction) {
      await prisma.paymentTransaction.update({
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
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        transactionId,
        orderId: statusResult.orderId,
        status: finalStatus,
        amount: statusResult.amount,
        expiryTime: statusResult.expiryTime,
        paymentType: statusResult.paymentType,
        qrCodeUrl: statusResult.qrCodeUrl,
        vaNumber: statusResult.vaNumber,
        bankCode: statusResult.bankCode,
        billerCode: statusResult.billerCode,
        billKey: statusResult.billKey,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check transaction status',
      },
      { status: 500 }
    );
  }
}
