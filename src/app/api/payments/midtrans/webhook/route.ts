import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { mapMidtransStatus, verifyMidtransSignature } from '@/services/midtrans.service';
import { createBusinessRecordFromSettledPayment } from '@/services/payment-fulfillment.service';

/**
 * POST /api/payments/midtrans/webhook
 * Midtrans webhook endpoint for backend integration.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const signatureValid = verifyMidtransSignature(payload);
    if (!signatureValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const orderId = String(payload.order_id || '');
    const transactionStatus = String(payload.transaction_status || 'pending');
    const mappedStatus = mapMidtransStatus(transactionStatus);

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { externalId: orderId },
    });

    if (!paymentTransaction) {
      return NextResponse.json(
        {
          success: true,
          message: 'Webhook received, payment not found in local database',
          data: { orderId, status: mappedStatus },
        },
        { status: 200 }
      );
    }

    const finalStatus =
      paymentTransaction.status === 'SETTLEMENT' ? paymentTransaction.status : mappedStatus;

    await prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: finalStatus,
        response: payload as Prisma.InputJsonValue,
      },
    });

    if (finalStatus === 'SETTLEMENT') {
      await createBusinessRecordFromSettledPayment({
        ...paymentTransaction,
        status: finalStatus,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId,
          status: finalStatus,
          paymentTransactionId: paymentTransaction.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process webhook',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Midtrans webhook endpoint is active',
      method: 'POST',
    },
    { status: 200 }
  );
}
