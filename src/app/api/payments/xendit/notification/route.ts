import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleWebhookNotification, verifyWebhookSignature } from '@/services/xendit.service';

/**
 * POST /api/payments/xendit/notification
 *
 * Webhook endpoint for Xendit payment notifications
 * This is called by Xendit when a payment status changes
 * Configure this URL in Xendit Dashboard
 */
export async function POST(request: NextRequest) {
  try {
    const notificationBody = await request.json();

    // Log webhook for debugging
    console.log('Xendit webhook received:', notificationBody);

    // Optional: Verify webhook signature for security
    const webhookSignature = request.headers.get('x-xendit-token');
    const webhookId = request.headers.get('x-xendit-webhook-id');
    const timestamp = request.headers.get('x-xendit-timestamp');

    if (webhookSignature && webhookId && timestamp) {
      const body = JSON.stringify(notificationBody);
      const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN || '';

      const isValid = verifyWebhookSignature(
        webhookSignature,
        webhookId,
        timestamp,
        body,
        webhookToken
      );

      if (!isValid) {
        console.warn('Invalid webhook signature');
        // Continue processing anyway for development, but log warning
      }
    }

    // Handle the webhook notification
    const webhookData = await handleWebhookNotification(notificationBody);

    const { orderId, transactionId, status, paymentType, fraudStatus } = webhookData;

    // Map Xendit status to our TransactionStatus
    let transactionStatus: 'PENDING' | 'SETTLEMENT' | 'EXPIRE' | 'FAILURE' = 'PENDING';

    if (
      status === 'PAID' ||
      status === 'paid' ||
      status === 'SETTLEMENT' ||
      status === 'settlement' ||
      status === 'SETTLED' ||
      status === 'settled'
    ) {
      transactionStatus = 'SETTLEMENT';
    } else if (status === 'PENDING' || status === 'pending') {
      transactionStatus = 'PENDING';
    } else if (status === 'EXPIRED' || status === 'expired' || status === 'EXPIRE') {
      transactionStatus = 'EXPIRE';
    } else if (status === 'FAILED' || status === 'failed' || status === 'cancelled' || status === 'FAILURE') {
      transactionStatus = 'FAILURE';
    }

    // Update payment transaction in database
    const paymentTransaction = await prisma.paymentTransaction.findFirst({
      where: { externalId: transactionId },
    });

    // In sandbox mode, allow processing without database record (for testing)
    const isSandbox = process.env.XENDIT_ENVIRONMENT !== 'production';
    if (!paymentTransaction && !isSandbox) {
      console.warn(`Payment transaction not found for transactionId: ${transactionId}`);
      return NextResponse.json(
        { error: 'Payment transaction not found' },
        { status: 404 }
      );
    }

    // Update transaction status only if it exists in database
    if (paymentTransaction) {
      await prisma.paymentTransaction.update({
        where: { id: paymentTransaction.id },
        data: {
          status: transactionStatus,
          response: webhookData.rawData as any,
        },
      });

      // If payment is successful (SETTLEMENT), update the related records
      if (transactionStatus === 'SETTLEMENT') {
        if (paymentTransaction.category === 'DONATION' && paymentTransaction.referenceDonorFund) {
          // Update donor fund status if needed
          console.log(`Donation settled for donor fund: ${paymentTransaction.referenceDonorFund}`);
        } else if (paymentTransaction.category === 'REPAYMENT' && paymentTransaction.referenceRepayment) {
          // Update repayment status to CONFIRMED
          await prisma.repayment.update({
            where: { id: paymentTransaction.referenceRepayment },
            data: { status: 'CONFIRMED' },
          });
          console.log(`Repayment confirmed: ${paymentTransaction.referenceRepayment}`);
        }
      }
    }

    // Log the update
    console.log('Payment transaction updated:', {
      transactionId,
      orderId,
      newStatus: transactionStatus,
    });

    // Return success response to Xendit
    return NextResponse.json(
      {
        success: true,
        message: paymentTransaction
          ? 'Webhook processed successfully'
          : 'Webhook received (sandbox mode - not stored)',
        transactionId,
        status: transactionStatus,
        sandboxMode: !paymentTransaction && isSandbox,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to process webhook',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/xendit/notification
 * Health check for the notification endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'Xendit notification endpoint is active',
      method: 'POST',
      description: 'Send Xendit webhook notifications to this endpoint',
    },
    { status: 200 }
  );
}
