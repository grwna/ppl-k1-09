import axios from 'axios';

// Initialize Xendit API client
const xenditAxios = axios.create({
  baseURL:
    process.env.XENDIT_ENVIRONMENT === 'production'
      ? 'https://api.xendit.co'
      : 'https://api.xendit.co',
  auth: {
    username: process.env.XENDIT_API_KEY || '',
    password: '',
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ChargeRequest {
  orderId: string;
  amount: number;
  description?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  metadata?: Record<string, unknown>;
}

export interface QrisChargeRequest extends ChargeRequest {
  paymentMethod: 'qris' | 'bank_transfer';
}

/**
 * Create QRIS QR Code payment charge using Xendit
 */
export async function createQrisCharge(request: QrisChargeRequest) {
  try {
    // Build Xendit Create Invoice payload (using v2 invoices API with QRIS)
    const payload = {
      external_id: request.orderId,
      amount: Math.round(request.amount),
      description: request.description || `Payment - ${request.orderId}`,
      invoice_expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      customer: {
        given_names: request.customerName || 'Customer',
        email: request.customerEmail || 'noemail@example.com',
        mobile_number: request.customerPhone || '6200000000',
      },
      currency: 'IDR',
      payment_methods: ['QRIS'],
      success_redirect_url:
        process.env.XENDIT_SUCCESS_REDIRECT_URL || 'http://localhost:3000/payment/success',
      failure_redirect_url:
        process.env.XENDIT_FAILURE_REDIRECT_URL || 'http://localhost:3000/payment',
    };

    console.log('Xendit QRIS charge payload:', JSON.stringify(payload, null, 2));
    console.log('Xendit API Key present:', !!process.env.XENDIT_API_KEY);

    const response = await xenditAxios.post('/v2/invoices', payload);

    console.log('Xendit QRIS charge response:', JSON.stringify(response.data, null, 2));

    return {
      success: true,
      transactionId: response.data.id,
      orderId: response.data.external_id,
      paymentType: 'qris',
      amount: response.data.amount,
      qrCodeUrl: response.data.qr_code || null,
      invoiceUrl: response.data.invoice_url || null,
      expiryDate: response.data.expiry_date,
      status: response.data.status,
      rawResponse: response.data,
    };
  } catch (err: any) {
    console.error('Xendit QRIS charge error:');
    if (err instanceof axios.AxiosError) {
      console.error('Status:', err.response?.status);
      console.error('Data:', JSON.stringify(err.response?.data, null, 2));
      console.error('Headers:', err.response?.headers);
    } else {
      console.error(err);
    }
    const errorMessage =
      err instanceof axios.AxiosError
        ? err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          err.message
        : err instanceof Error
          ? err.message
          : 'Unknown error';
    throw new Error(`Failed to create QRIS charge: ${errorMessage}`);
  }
}

/**
 * Create Bank Virtual Account payment charge using Xendit
 */
export async function createBankTransferCharge(request: ChargeRequest) {
  try {
    // Use v1 invoices endpoint with bank transfer configuration
    const payload = {
      external_id: request.orderId,
      amount: Math.round(request.amount),
      payer_email: request.customerEmail || 'noemail@example.com',
      description: request.description || `Payment - ${request.orderId}`,
      duration: 86400, // 24 hours in seconds
      reminder: true,
      success_redirect_url:
        process.env.XENDIT_SUCCESS_REDIRECT_URL || 'http://localhost:3000/payment/success',
      failure_redirect_url:
        process.env.XENDIT_FAILURE_REDIRECT_URL || 'http://localhost:3000/payment',
      customer: {
        given_names: request.customerName || 'Customer',
        email: request.customerEmail || 'noemail@example.com',
        mobile_number: request.customerPhone || '6200000000',
      },
    };

    console.log('Xendit Bank Transfer charge payload:', JSON.stringify(payload, null, 2));
    console.log('Xendit API Key present:', !!process.env.XENDIT_API_KEY);
    console.log('Endpoint: /invoices (v1)');

    const response = await xenditAxios.post('/invoices', payload);

    console.log('Xendit Bank Transfer charge response:', JSON.stringify(response.data, null, 2));

    // Extract bank account details if available
    const bankCode = response.data.bank_code || 'BCA';
    const bankAccountNumber = response.data.account_number || null;

    return {
      success: true,
      transactionId: response.data.id,
      orderId: response.data.external_id,
      paymentType: 'bank_transfer',
      amount: response.data.amount,
      bankCode: bankCode,
      bankAccountNumber: bankAccountNumber,
      invoiceUrl: response.data.invoice_url || null,
      expiryDate: response.data.expiry_date,
      status: response.data.status,
      rawResponse: response.data,
    };
  } catch (err: any) {
    console.error('Xendit Bank Transfer charge error:');
    if (err instanceof axios.AxiosError) {
      console.error('Status:', err.response?.status);
      console.error('Data:', JSON.stringify(err.response?.data, null, 2));
      console.error('Headers:', err.response?.headers);
    } else {
      console.error(err);
    }
    const errorMessage =
      err instanceof axios.AxiosError
        ? err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          err.message
        : err instanceof Error
          ? err.message
          : 'Unknown error';
    throw new Error(`Failed to create Bank Transfer charge: ${errorMessage}`);
  }
}

/**
 * Get invoice details from Xendit
 */
export async function getInvoiceDetails(invoiceId: string) {
  try {
    console.log(`[Xendit] Fetching invoice details for ID: ${invoiceId}`);
    const response = await xenditAxios.get(`/v2/invoices/${invoiceId}`);
    console.log(`[Xendit] Invoice response status: "${response.data.status}"`);
    return {
      success: true,
      transactionId: response.data.id,
      orderId: response.data.external_id,
      status: response.data.status,
      amount: response.data.amount,
      paidAmount: response.data.paid_amount || 0,
      paymentMethod: response.data.payment_method || null,
      paymentChannel: response.data.payment_channel || null,
      paidAt: response.data.paid_at,
      expiryDate: response.data.expiry_date,
      rawResponse: response.data,
    };
  } catch (err: any) {
    console.error('Xendit get invoice error:', err);
    const errorMessage =
      err instanceof axios.AxiosError
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : 'Unknown error';
    throw new Error(`Failed to get invoice details: ${errorMessage}`);
  }
}

/**
 * Get bank account details from Xendit
 */
export async function getBankTransferDetails(invoiceId: string) {
  try {
    console.log(`[Xendit] Fetching bank transfer invoice details for ID: ${invoiceId}`);
    const response = await xenditAxios.get(`/invoices/${invoiceId}`);
    console.log(`[Xendit] Bank transfer invoice response status: "${response.data.status}"`);
    console.log(`[Xendit] Bank transfer full response:`, JSON.stringify(response.data, null, 2));

    return {
      success: true,
      transactionId: response.data.id,
      orderId: response.data.external_id,
      status: response.data.status,
      amount: response.data.amount,
      paidAmount: response.data.paid_amount || 0,
      paymentMethod: response.data.payment_method || null,
      paymentChannel: response.data.payment_channel || null,
      paidAt: response.data.paid_at,
      expiryDate: response.data.expiry_date,
      bankCode: response.data.bank_code || null,
      bankAccountNumber: response.data.account_number || null,
      rawResponse: response.data,
    };
  } catch (err: any) {
    console.error('Xendit get bank transfer details error:', err);
    if (err instanceof axios.AxiosError) {
      console.error('[Xendit] Error Status:', err.response?.status);
      console.error('[Xendit] Error Data:', JSON.stringify(err.response?.data, null, 2));
    }
    const errorMessage =
      err instanceof axios.AxiosError
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : 'Unknown error';
    throw new Error(`Failed to get bank transfer details: ${errorMessage}`);
  }
}

/**
 * Verify webhook signature from Xendit
 */
export function verifyWebhookSignature(
  webhookSignatureHeader: string,
  webhookId: string,
  timestamp: string,
  body: string,
  webhookVerificationToken: string
): boolean {
  try {
    const crypto = require('crypto');

    // Construct the message to verify
    const message = `${webhookId}${timestamp}${body}`;

    // Create HMAC SHA256 signature
    const signature = crypto
      .createHmac('sha256', webhookVerificationToken)
      .update(message)
      .digest('base64');

    // Compare signatures
    return signature === webhookSignatureHeader;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

/**
 * Handle Xendit webhook notification
 */
export async function handleWebhookNotification(webhookData: Record<string, any>) {
  try {
    const eventType = webhookData.event ?? webhookData.type;

    // Handle Invoice Paid event
    if (eventType === 'invoice.paid' || eventType === 'INVOICE_PAID') {
      const invoiceData = webhookData.data || webhookData;
      return {
        orderId: invoiceData.external_id,
        transactionId: invoiceData.id,
        paymentType: 'qris',
        status: 'SETTLEMENT',
        fraudStatus: 'accept',
        amount: invoiceData.amount,
        paidAmount: invoiceData.paid_amount,
        paymentMethod: invoiceData.payment_method,
        paidAt: invoiceData.paid_at,
        rawData: invoiceData,
      };
    }

    // Handle Invoice Expired event
    if (eventType === 'invoice.expired' || eventType === 'INVOICE_EXPIRED') {
      const invoiceData = webhookData.data || webhookData;
      return {
        orderId: invoiceData.external_id,
        transactionId: invoiceData.id,
        paymentType: 'qris',
        status: 'EXPIRE',
        fraudStatus: 'accept',
        amount: invoiceData.amount,
        rawData: invoiceData,
      };
    }

    // Handle Bank Transfer Paid event
    if (eventType === 'bank_account.statement' || eventType === 'BANK_ACCOUNT_STATEMENT') {
      const bankData = webhookData.data || webhookData;
      return {
        orderId: bankData.external_id,
        transactionId: bankData.id,
        paymentType: 'bank_transfer',
        status: 'SETTLEMENT',
        fraudStatus: 'accept',
        amount: bankData.amount,
        bankCode: bankData.bank_code,
        rawData: bankData,
      };
    }

    // Unknown event type
    return {
      orderId: webhookData.external_id,
      transactionId: webhookData.id,
      paymentType: 'unknown',
      status: 'PENDING',
      rawData: webhookData,
    };
  } catch (error) {
    console.error('Xendit webhook handling error:', error);
    throw new Error(
      `Failed to handle webhook: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
