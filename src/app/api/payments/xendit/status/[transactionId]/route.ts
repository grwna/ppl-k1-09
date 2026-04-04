import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceDetails, getBankTransferDetails } from '@/services/xendit.service';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * GET /api/payments/xendit/status/[transactionId]
 * Check the status of a payment transaction
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    // Validate transactionId
    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Get authenticated user (optional for security)
    const session = await auth();

    // Find payment transaction in database
    let paymentTransaction;
    try {
      paymentTransaction = await prisma.paymentTransaction.findFirst({
        where: { externalId: transactionId },
      });
    } catch (error) {
      // In sandbox mode, allow querying Xendit directly
      console.log('Database query skipped in sandbox mode');
      paymentTransaction = null;
    }

    // For testing in sandbox mode, we'll query Xendit directly
    const isSandbox = process.env.XENDIT_ENVIRONMENT !== 'production';

    // Get transaction status from Xendit
    let statusResult;
    let paymentType = paymentTransaction?.paymentType || 'qris';

    try {
      // Try to get as invoice first (QRIS)
      try {
        statusResult = await getInvoiceDetails(transactionId);
        paymentType = 'qris';
      } catch (invoiceError) {
        // If invoice fails, try as bank transfer
        try {
          statusResult = await getBankTransferDetails(transactionId);
          paymentType = 'bank_transfer';
        } catch (bankError) {
          // If both fail, throw the original error
          throw invoiceError;
        }
      }
    } catch (error) {
      // If Xendit API call fails in sandbox, return mock success
      if (isSandbox && !paymentTransaction) {
        return NextResponse.json(
          {
            success: true,
            transactionId,
            status: 'PENDING',
            fraudStatus: 'accept',
            amount: 0,
            source: 'sandbox-mock',
            message: 'Sandbox mode - returning mock status',
          },
          { status: 200 }
        );
      }
      // If we have a database record, return it
      if (paymentTransaction) {
        return NextResponse.json(
          {
            success: true,
            transactionId: paymentTransaction.externalId,
            status: paymentTransaction.status,
            amount: paymentTransaction.amount,
            category: paymentTransaction.category,
            paymentType: paymentTransaction.paymentType,
            source: 'database',
            message: 'Status retrieved from database (Xendit API not available)',
          },
          { status: 200 }
        );
      }
      throw error;
    }

    const status = (statusResult as any).status;
    const amount = (statusResult as any).amount;
    const paidAmount = (statusResult as any).paidAmount || 0;

    console.log(`[Xendit Status Check] Raw status from API: "${status}"`);

    // Map Xendit status to our standard status
    let mappedStatus: 'PENDING' | 'SETTLEMENT' | 'EXPIRE' | 'FAILURE' = 'PENDING';
    if (
      status === 'PAID' ||
      status === 'paid' ||
      status === 'SETTLEMENT' ||
      status === 'settlement' ||
      status === 'SETTLED' ||
      status === 'settled'
    ) {
      mappedStatus = 'SETTLEMENT';
    } else if (status === 'PENDING' || status === 'pending') {
      mappedStatus = 'PENDING';
    } else if (status === 'EXPIRED' || status === 'expired' || status === 'EXPIRE') {
      mappedStatus = 'EXPIRE';
    } else if (status === 'FAILED' || status === 'failed' || status === 'cancelled' || status === 'FAILURE') {
      mappedStatus = 'FAILURE';
    }

    console.log(`[Xendit Status Check] Mapped status: "${mappedStatus}"`);
    console.log(`[Xendit Status Check] Payment Type: ${paymentType}`);

    // Update payment transaction with the latest status from Xendit (if it exists)
    if (paymentTransaction) {
      await prisma.paymentTransaction.update({
        where: { id: paymentTransaction.id },
        data: {
          status: mappedStatus,
          response: statusResult.rawResponse as any,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        transactionId,
        status: mappedStatus,
        amount,
        paidAmount: paidAmount || 0,
        paymentType,
        message: 'Transaction status retrieved successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to check transaction status',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments/xendit/status
 * Check payment status by external transaction ID
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, orderId } = body;

    if (!transactionId && !orderId) {
      return NextResponse.json(
        {
          error: 'Either transactionId or orderId must be provided',
        },
        { status: 400 }
      );
    }

    // Find payment transaction (if it exists)
    let paymentTransaction;
    try {
      if (transactionId) {
        paymentTransaction = await prisma.paymentTransaction.findFirst({
          where: { externalId: transactionId },
        });
      } else if (orderId) {
        // Try to find by response data
        paymentTransaction = await prisma.paymentTransaction.findFirst({
          where: {
            OR: [
              {
                response: {
                  path: ['external_id'],
                  equals: orderId,
                },
              },
            ],
          },
        });
      }
    } catch (error) {
      console.log('Database query skipped in sandbox mode');
      paymentTransaction = null;
    }

    const isSandbox = process.env.XENDIT_ENVIRONMENT !== 'production';
    const idToSearch = transactionId || orderId;

    // Get transaction status from Xendit
    let statusResult;
    let paymentType = paymentTransaction?.paymentType || 'qris';

    try {
      // Try to get as invoice first (QRIS)
      try {
        statusResult = await getInvoiceDetails(idToSearch);
        paymentType = 'qris';
      } catch (invoiceError) {
        // If invoice fails, try as bank transfer
        try {
          statusResult = await getBankTransferDetails(idToSearch);
          paymentType = 'bank_transfer';
        } catch (bankError) {
          throw invoiceError;
        }
      }
    } catch (error) {
      // In sandbox without database record, return mock status
      if (isSandbox && !paymentTransaction) {
        return NextResponse.json(
          {
            success: true,
            transactionId: idToSearch,
            status: 'PENDING',
            fraudStatus: 'accept',
            amount: 0,
            source: 'sandbox-mock',
            message: 'Sandbox mode - returning mock status',
          },
          { status: 200 }
        );
      }
      if (!paymentTransaction) {
        return NextResponse.json(
          { error: 'Payment transaction not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    const status = (statusResult as any).status;
    const amount = (statusResult as any).amount;
    const paidAmount = (statusResult as any).paidAmount || 0;

    console.log(`[Xendit Status Check - POST] Raw status from API: "${status}"`);

    // Map status
    let mappedStatus: 'PENDING' | 'SETTLEMENT' | 'EXPIRE' | 'FAILURE' = 'PENDING';
    if (
      status === 'PAID' ||
      status === 'paid' ||
      status === 'SETTLEMENT' ||
      status === 'settlement' ||
      status === 'SETTLED' ||
      status === 'settled'
    ) {
      mappedStatus = 'SETTLEMENT';
    } else if (status === 'PENDING' || status === 'pending') {
      mappedStatus = 'PENDING';
    } else if (status === 'EXPIRED' || status === 'expired' || status === 'EXPIRE') {
      mappedStatus = 'EXPIRE';
    } else if (status === 'FAILED' || status === 'failed' || status === 'cancelled' || status === 'FAILURE') {
      mappedStatus = 'FAILURE';
    }

    console.log(`[Xendit Status Check - POST] Mapped status: "${mappedStatus}"`);

    // Update transaction status if it exists
    if (paymentTransaction) {
      await prisma.paymentTransaction.update({
        where: { id: paymentTransaction.id },
        data: {
          status: mappedStatus,
          response: statusResult.rawResponse as any,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        transactionId: idToSearch,
        status: mappedStatus,
        amount,
        paidAmount: paidAmount || 0,
        category: paymentTransaction?.category,
        paymentType: paymentTransaction?.paymentType || paymentType,
        sandboxMode: !paymentTransaction && isSandbox,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Status endpoint error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to check transaction status',
      },
      { status: 500 }
    );
  }
}
