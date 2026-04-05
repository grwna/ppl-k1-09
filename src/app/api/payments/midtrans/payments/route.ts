import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import {
  createQrisCharge,
  createVaCharge,
  getMidtransSimulatorLink,
  type MidtransPaymentMethod,
  type VABank,
} from '@/services/midtrans.service';

type TransactionType = 'donation' | 'repayment';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string) {
  return UUID_REGEX.test(value);
}

interface CreatePaymentBody {
  amount: number;
  transactionType: TransactionType;
  paymentMethod: MidtransPaymentMethod;
  vaBank?: VABank;
  referenceId: string;
  customer?: {
    userId?: string;
    email?: string;
    name?: string;
    phone?: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * POST /api/payments/midtrans/payments
 * Backend-friendly Midtrans create payment endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePaymentBody;

    const {
      amount,
      transactionType,
      paymentMethod,
      vaBank = 'bca',
      referenceId,
      customer,
      metadata,
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

    if (customer?.userId && !isUuid(customer.userId.trim())) {
      return NextResponse.json({ error: 'customer.userId must be a valid UUID' }, { status: 400 });
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

    const customerName = customer?.name || 'Customer';
    const customerEmail = customer?.email;
    const customerPhone = customer?.phone;

    const orderId = `${transactionType.toUpperCase()}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    const finalDescription = `${transactionType === 'donation' ? 'Donation' : 'Loan Repayment'} - ${orderId}`;

    const commonMetadata: Record<string, unknown> = {
      transactionType,
      referenceId,
      paymentMethod,
      vaBank: paymentMethod === 'va' ? vaBank : null,
      customerUserId: customer?.userId || null,
      ...(metadata || {}),
    };

    const chargeResult =
      paymentMethod === 'qris'
        ? await createQrisCharge({
            orderId,
            amount: Math.round(amount),
            customerEmail,
            customerName,
            customerPhone,
            description: finalDescription,
            metadata: commonMetadata,
          })
        : await createVaCharge(
            {
              orderId,
              amount: Math.round(amount),
              customerEmail,
              customerName,
              customerPhone,
              description: finalDescription,
              metadata: commonMetadata,
            },
            vaBank
          );

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
        data: {
          paymentTransactionId: paymentTransaction.id,
          orderId: chargeResult.orderId,
          transactionId: chargeResult.transactionId,
          transactionType,
          paymentMethod,
          vaBank: paymentMethod === 'va' ? vaBank : null,
          amount: chargeResult.amount,
          status: chargeResult.status,
          expiryTime: chargeResult.expiryTime,
          qris: {
            qrCodeImageUrl:
              paymentMethod === 'qris' && 'qrCodeUrl' in chargeResult
                ? chargeResult.qrCodeUrl
                : null,
          },
          va: {
            bankCode: paymentMethod === 'va' && 'bankCode' in chargeResult ? chargeResult.bankCode : null,
            vaNumber: paymentMethod === 'va' && 'vaNumber' in chargeResult ? chargeResult.vaNumber : null,
            billerCode:
              paymentMethod === 'va' && 'billerCode' in chargeResult
                ? chargeResult.billerCode
                : null,
            billKey: paymentMethod === 'va' && 'billKey' in chargeResult ? chargeResult.billKey : null,
          },
          simulator: {
            url: getMidtransSimulatorLink(paymentMethod, paymentMethod === 'va' ? vaBank : undefined),
          },
          metadata: commonMetadata,
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
