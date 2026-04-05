import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { buildPaymentTransactionDetail } from '@/services/payment-transaction-presenter.service';
import { validatePaymentTransactionAccess } from '@/services/midtrans-payment-request.service';

/**
 * GET /api/payments/midtrans/payments/[orderId]
 * Fetch payment status/details from local PaymentTransaction.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { externalId: orderId },
    });

    if (!paymentTransaction) {
      return NextResponse.json({ error: 'Payment transaction not found' }, { status: 404 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const accessCheck = await validatePaymentTransactionAccess({
      category: paymentTransaction.category,
      referenceId: paymentTransaction.referenceId,
      currentUserId: currentUser.id,
      findLoanBorrowerId: async (loanId) => {
        const loan = await prisma.loan.findUnique({
          where: { id: loanId },
          select: {
            application: {
              select: {
                borrowerId: true,
              },
            },
          },
        });

        return loan?.application.borrowerId || null;
      },
    });

    if (!accessCheck.ok) {
      return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
    }

    const detail = buildPaymentTransactionDetail(paymentTransaction);

    return NextResponse.json(
      {
        success: true,
        data: detail,
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
