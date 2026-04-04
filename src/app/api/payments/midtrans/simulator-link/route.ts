import { NextRequest, NextResponse } from 'next/server';
import {
  getMidtransSimulatorLink,
  type MidtransPaymentMethod,
  type VABank,
} from '@/services/midtrans.service';

/**
 * GET /api/payments/midtrans/simulator-link?paymentMethod=qris|va&vaBank=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentMethod = searchParams.get('paymentMethod') as MidtransPaymentMethod | null;
  const vaBank = searchParams.get('vaBank') as VABank | null;

  if (!paymentMethod || !['qris', 'va'].includes(paymentMethod)) {
    return NextResponse.json(
      { error: 'paymentMethod is required and must be qris or va' },
      { status: 400 }
    );
  }

  if (paymentMethod === 'va' && !vaBank) {
    return NextResponse.json({ error: 'vaBank is required when paymentMethod=va' }, { status: 400 });
  }

  const url = getMidtransSimulatorLink(paymentMethod, vaBank || undefined);

  return NextResponse.json(
    {
      success: true,
      data: {
        paymentMethod,
        vaBank,
        simulatorUrl: url,
      },
    },
    { status: 200 }
  );
}
