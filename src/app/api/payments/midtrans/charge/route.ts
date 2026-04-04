import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import {
  createQrisCharge,
  createVaCharge,
  type VABank,
} from '@/services/midtrans.service';

type TransactionType = 'donation' | 'repayment';
type PaymentMethod = 'qris' | 'va';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string) {
  return UUID_REGEX.test(value);
}

/**
 * POST /api/payments/midtrans/charge
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      amount,
      transactionType,
      referenceId,
      paymentMethod = 'qris',
      vaBank = 'bca',
    }: {
      amount: number;
      transactionType: TransactionType;
      referenceId: string;
      paymentMethod?: PaymentMethod;
      vaBank?: VABank;
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!['donation', 'repayment'].includes(transactionType)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    if (!['qris', 'va'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    if (!referenceId || typeof referenceId !== 'string' || !referenceId.trim()) {
      return NextResponse.json({ error: 'referenceId is required' }, { status: 400 });
    }

    if (!isUuid(referenceId.trim())) {
      return NextResponse.json({ error: 'referenceId must be a valid UUID' }, { status: 400 });
    }

    if (paymentMethod === 'qris' && Number(amount) < 1500) {
      return NextResponse.json(
        { error: 'Minimum QRIS amount is IDR 1,500' },
        { status: 400 }
      );
    }

    const allowedVaBanks: VABank[] = [
      'bca',
      'bri',
      'bni',
      'permata',
      'cimb',
      'mandiri_bill',
      'danamon',
      'bsi',
      'seabank',
    ];
    if (paymentMethod === 'va' && !allowedVaBanks.includes(vaBank)) {
      return NextResponse.json({ error: 'Invalid VA bank' }, { status: 400 });
    }

    const orderId = `${transactionType.toUpperCase()}-${Date.now()}-${user.id.slice(0, 8)}`;

    let chargeResult:
      | Awaited<ReturnType<typeof createQrisCharge>>
      | Awaited<ReturnType<typeof createVaCharge>>;

    if (paymentMethod === 'qris') {
      chargeResult = await createQrisCharge({
        orderId,
        amount: Math.round(amount),
        customerEmail: user.email,
        customerName: user.name || 'Customer',
        customerPhone: '',
        description: `${transactionType === 'donation' ? 'Donation' : 'Loan Repayment'} - ${orderId}`,
        metadata: {
          userId: user.id,
          transactionType,
          referenceId,
          paymentMethod: 'qris',
        },
      });
    } else {
      chargeResult = await createVaCharge(
        {
          orderId,
          amount: Math.round(amount),
          customerEmail: user.email,
          customerName: user.name || 'Customer',
          customerPhone: '',
          description: `${transactionType === 'donation' ? 'Donation' : 'Loan Repayment'} - ${orderId}`,
          metadata: {
            userId: user.id,
            transactionType,
            referenceId,
            paymentMethod: 'va',
            vaBank,
          },
        },
        vaBank
      );
    }

    const paymentTransaction = await prisma.paymentTransaction.create({
      data: {
        externalId: chargeResult.orderId,
        referenceId,
        category: transactionType === 'donation' ? 'DONATION' : 'REPAYMENT',
        paymentType: paymentMethod,
        amount: Number(amount),
        status: 'PENDING',
        response: chargeResult.rawResponse as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: chargeResult.orderId,
        transactionId: chargeResult.transactionId,
        paymentType: paymentMethod,
        amount: chargeResult.amount,
        status: chargeResult.status,
        expiryTime: chargeResult.expiryTime,
        qrCodeUrl: 'qrCodeUrl' in chargeResult ? chargeResult.qrCodeUrl : null,
        vaNumber: 'vaNumber' in chargeResult ? chargeResult.vaNumber : null,
        bankCode: 'bankCode' in chargeResult ? chargeResult.bankCode : null,
        billerCode: 'billerCode' in chargeResult ? chargeResult.billerCode : null,
        billKey: 'billKey' in chargeResult ? chargeResult.billKey : null,
        paymentTransactionId: paymentTransaction.id,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create Midtrans charge',
      },
      { status: 500 }
    );
  }
}
