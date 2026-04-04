import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import {
  getTransactionStatus,
  getMidtransSimulatorLink,
  mapMidtransStatus,
  type VABank,
} from '@/services/midtrans.service';
import { createBusinessRecordFromSettledPayment } from '@/services/payment-fulfillment.service';

/**
 * GET /api/payments/midtrans/payments/[orderId]
 * Fetch payment status/details and sync to local PaymentTransaction.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { externalId: orderId },
    });

    const statusResult = await getTransactionStatus(orderId);
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

    const vaBank = (statusResult.bankCode || undefined) as VABank | undefined;

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: statusResult.orderId,
          transactionId: statusResult.transactionId,
          status: finalStatus,
          rawMidtransStatus: statusResult.status,
          amount: statusResult.amount,
          expiryTime: statusResult.expiryTime,
          paymentType: statusResult.paymentType,
          qris: {
            qrCodeImageUrl: statusResult.qrCodeUrl,
          },
          va: {
            bankCode: statusResult.bankCode,
            vaNumber: statusResult.vaNumber,
            billerCode: statusResult.billerCode,
            billKey: statusResult.billKey,
          },
          simulator: {
            url:
              statusResult.paymentType === 'qris'
                ? getMidtransSimulatorLink('qris')
                : getMidtransSimulatorLink('va', vaBank),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get payment detail',
      },
      { status: 500 }
    );
  }
}
