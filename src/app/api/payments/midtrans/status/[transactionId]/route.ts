import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validatePaymentTransactionAccess } from '@/services/midtrans-payment-request.service';
import { syncPaymentTransactionFromMidtrans } from '@/services/payment-status-sync.service';

/**
 * GET /api/payments/midtrans/status/[transactionId]
 * transactionId is mapped to Midtrans order_id
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { externalId: transactionId },
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

    const syncResult = await syncPaymentTransactionFromMidtrans(transactionId);
    const updatedPaymentTransaction = syncResult.paymentTransaction;
    const statusResult = syncResult.detail;

    if (!updatedPaymentTransaction || !statusResult) {
      return NextResponse.json({ error: 'Payment transaction not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        transactionId,
        orderId: statusResult.orderId,
        status: updatedPaymentTransaction.status,
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
