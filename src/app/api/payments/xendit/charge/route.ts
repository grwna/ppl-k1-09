import { NextRequest, NextResponse } from 'next/server';
import { createQrisCharge, createBankTransferCharge } from '@/services/xendit.service';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * POST /api/payments/xendit/charge
 * Create a QRIS or Bank Transfer payment charge for donations or loan repayments
 *
 * Request body:
 * {
 *   "amount": number,
 *   "transactionType": "donation" | "repayment",
 *   "referenceId": string (donorFundId or repaymentId),
 *   "paymentMethod": "qris" | "bank_transfer",
 *   "description": string (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { amount, transactionType, referenceId, paymentMethod = 'qris', description } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!['donation', 'repayment'].includes(transactionType)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    if (!['qris', 'bank_transfer'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    if (!referenceId) {
      return NextResponse.json({ error: 'Reference ID is required' }, { status: 400 });
    }

    // Verify reference exists (skip in sandbox mode for testing)
    const isSandbox = process.env.XENDIT_ENVIRONMENT !== 'production';

    if (!isSandbox || process.env.NODE_ENV === 'production') {
      if (transactionType === 'donation') {
        const donorFund = await prisma.donorFund.findUnique({
          where: { id: referenceId },
        });
        if (!donorFund) {
          return NextResponse.json({ error: 'Donor fund not found' }, { status: 404 });
        }
      } else if (transactionType === 'repayment') {
        const repayment = await prisma.repayment.findUnique({
          where: { id: referenceId },
        });
        if (!repayment) {
          return NextResponse.json({ error: 'Repayment not found' }, { status: 404 });
        }
      }
    }

    // Generate unique order ID
    const orderId = `${transactionType.toUpperCase()}-${Date.now()}-${user.id.slice(0, 8)}`;

    let qrCodeUrl: string | null = null;
    let invoiceUrl: string | null = null;
    let bankAccountNumber: string | null = null;
    let bankCode: string | null = null;
    let transactionId: string;
    let orderId_out: string;
    let expiryDate: string;
    let chargeAmount: number;
    let rawResponse: any;

    // Create charge based on payment method
    if (paymentMethod === 'qris') {
      const chargeResult = await createQrisCharge({
        orderId,
        amount: Math.round(amount),
        paymentMethod: 'qris',
        customerEmail: user.email,
        customerName: user.name || 'Customer',
        customerPhone: '',
        description:
          description ||
          `${transactionType === 'donation' ? 'Donation' : 'Loan Repayment'} - ${orderId}`,
        metadata: {
          userId: user.id,
          transactionType,
          referenceId,
          paymentMethod: 'qris',
        },
      });
      qrCodeUrl = chargeResult.qrCodeUrl;
      invoiceUrl = chargeResult.invoiceUrl;
      transactionId = chargeResult.transactionId;
      orderId_out = chargeResult.orderId;
      expiryDate = chargeResult.expiryDate;
      chargeAmount = chargeResult.amount;
      rawResponse = chargeResult.rawResponse;
    } else {
      const chargeResult = await createBankTransferCharge({
        orderId,
        amount: Math.round(amount),
        customerEmail: user.email,
        customerName: user.name || 'Customer',
        customerPhone: '',
        description:
          description ||
          `${transactionType === 'donation' ? 'Donation' : 'Loan Repayment'} - ${orderId}`,
        metadata: {
          userId: user.id,
          transactionType,
          referenceId,
          paymentMethod: 'bank_transfer',
        },
      });
      bankAccountNumber = chargeResult.bankAccountNumber;
      bankCode = chargeResult.bankCode;
      transactionId = chargeResult.transactionId;
      orderId_out = chargeResult.orderId;
      expiryDate = chargeResult.expiryDate;
      invoiceUrl = chargeResult.invoiceUrl || null;
      chargeAmount = chargeResult.amount;
      rawResponse = chargeResult.rawResponse;
    }

    // Store payment transaction in database (skip in sandbox mode for testing)
    let paymentTransactionId = null;

    if (!isSandbox || process.env.NODE_ENV === 'production') {
      const paymentTransaction = await prisma.paymentTransaction.create({
        data: {
          externalId: transactionId,
          referenceDonorFund: transactionType === 'donation' ? referenceId : null,
          referenceRepayment: transactionType === 'repayment' ? referenceId : null,
          category: transactionType === 'donation' ? 'DONATION' : 'REPAYMENT',
          paymentType: paymentMethod === 'qris' ? 'qris' : 'bank_transfer',
          amount: amount,
          status: 'PENDING',
          response: rawResponse as any,
        },
      });
      paymentTransactionId = paymentTransaction.id;
    }

    return NextResponse.json(
      {
        success: true,
        orderId: orderId_out,
        transactionId: transactionId,
        qrCodeUrl: qrCodeUrl,
        invoiceUrl: invoiceUrl,
        bankAccountNumber: bankAccountNumber,
        bankCode: bankCode,
        expiryDate: expiryDate,
        paymentType: paymentMethod,
        amount: chargeAmount,
        sandboxMode: isSandbox && process.env.NODE_ENV !== 'production',
        paymentTransactionId: paymentTransactionId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Charge endpoint error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create payment charge',
      },
      { status: 500 }
    );
  }
}
