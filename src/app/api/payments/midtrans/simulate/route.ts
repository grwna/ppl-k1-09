import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { simulateTransactionSettlement } from '@/services/midtrans.service';
import { createBusinessRecordFromSettledPayment } from '@/services/payment-fulfillment.service';

/**
 * POST /api/payments/midtrans/simulate
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (process.env.MIDTRANS_ENVIRONMENT === 'production') {
      return NextResponse.json(
        { error: 'Simulation is only available in sandbox mode' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { orderId } = body as { orderId?: string };

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const simulationResult = await simulateTransactionSettlement(orderId);

    await prisma.paymentTransaction.updateMany({
      where: { externalId: orderId },
      data: {
        status: 'SETTLEMENT',
        response: simulationResult.rawResponse as Prisma.InputJsonValue,
      },
    });

    const settledTransaction = await prisma.paymentTransaction.findFirst({
      where: { externalId: orderId },
    });

    if (settledTransaction) {
      await createBusinessRecordFromSettledPayment(settledTransaction);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Simulation sent to Midtrans sandbox',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to simulate transaction',
      },
      { status: 500 }
    );
  }
}
