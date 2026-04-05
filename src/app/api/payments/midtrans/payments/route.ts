import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import {
  createQrisCharge,
  createVaCharge,
  getMidtransSimulatorLink,
} from '@/services/midtrans.service';
import {
  normalizePaymentRequest,
  validateRepaymentOwnership,
  type CreatePaymentBody,
} from '@/services/midtrans-payment-request.service';

/**
 * POST /api/payments/midtrans/payments
 * Session-authenticated Midtrans create payment endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as CreatePaymentBody;
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const normalizedRequest = normalizePaymentRequest(body, {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
    });

    if (!normalizedRequest.ok) {
      return NextResponse.json({ error: normalizedRequest.error }, { status: normalizedRequest.status });
    }

    const { data } = normalizedRequest;
    const ownershipCheck = await validateRepaymentOwnership({
      transactionType: data.transactionType,
      referenceId: data.referenceId,
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

    if (!ownershipCheck.ok) {
      return NextResponse.json({ error: ownershipCheck.error }, { status: ownershipCheck.status });
    }

    const orderId = `${data.transactionType.toUpperCase()}-${Date.now()}-${currentUser.id.slice(0, 8)}`;

    const finalDescription = `${data.transactionType === 'donation' ? 'Donation' : 'Loan Repayment'} - ${orderId}`;

    const chargeResult =
      data.paymentMethod === 'qris'
        ? await createQrisCharge({
            orderId,
            amount: data.amount,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            description: finalDescription,
            metadata: data.metadata,
          })
        : await createVaCharge(
            {
              orderId,
              amount: data.amount,
              customerEmail: data.customerEmail,
              customerName: data.customerName,
              customerPhone: data.customerPhone,
              description: finalDescription,
              metadata: data.metadata,
            },
            data.vaBank
          );

    const paymentTransaction = await prisma.paymentTransaction.create({
      data: {
        externalId: chargeResult.orderId,
        referenceId: data.referenceId,
        category: data.transactionType === 'donation' ? 'DONATION' : 'REPAYMENT',
        paymentType: data.paymentMethod,
        amount: data.amount,
        status: 'PENDING',
        response: chargeResult.rawResponse as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: chargeResult.orderId,
        transactionId: chargeResult.transactionId,
        paymentType: data.paymentMethod,
        amount: chargeResult.amount,
        status: chargeResult.status,
        expiryTime: chargeResult.expiryTime,
        qrCodeUrl:
          data.paymentMethod === 'qris' && 'qrCodeUrl' in chargeResult ? chargeResult.qrCodeUrl : null,
        vaNumber: data.paymentMethod === 'va' && 'vaNumber' in chargeResult ? chargeResult.vaNumber : null,
        bankCode: data.paymentMethod === 'va' && 'bankCode' in chargeResult ? chargeResult.bankCode : null,
        billerCode:
          data.paymentMethod === 'va' && 'billerCode' in chargeResult ? chargeResult.billerCode : null,
        billKey: data.paymentMethod === 'va' && 'billKey' in chargeResult ? chargeResult.billKey : null,
        paymentTransactionId: paymentTransaction.id,
        data: {
          paymentTransactionId: paymentTransaction.id,
          orderId: chargeResult.orderId,
          transactionId: chargeResult.transactionId,
          transactionType: data.transactionType,
          paymentMethod: data.paymentMethod,
          vaBank: data.paymentMethod === 'va' ? data.vaBank : null,
          amount: chargeResult.amount,
          status: chargeResult.status,
          expiryTime: chargeResult.expiryTime,
          qris: {
            qrCodeImageUrl:
              data.paymentMethod === 'qris' && 'qrCodeUrl' in chargeResult
                ? chargeResult.qrCodeUrl
                : null,
          },
          va: {
            bankCode: data.paymentMethod === 'va' && 'bankCode' in chargeResult ? chargeResult.bankCode : null,
            vaNumber: data.paymentMethod === 'va' && 'vaNumber' in chargeResult ? chargeResult.vaNumber : null,
            billerCode:
              data.paymentMethod === 'va' && 'billerCode' in chargeResult
                ? chargeResult.billerCode
                : null,
            billKey: data.paymentMethod === 'va' && 'billKey' in chargeResult ? chargeResult.billKey : null,
          },
          simulator: {
            url: getMidtransSimulatorLink(
              data.paymentMethod,
              data.paymentMethod === 'va' ? data.vaBank : undefined
            ),
          },
          metadata: data.metadata,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create payment',
      },
      { status: 500 }
    );
  }
}
