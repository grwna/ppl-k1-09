import axios from 'axios';
import crypto from 'crypto';

const isProduction = process.env.MIDTRANS_ENVIRONMENT === 'production';
const midtransServerKey = process.env.MIDTRANS_SERVER_KEY || '';
const midtransExpiryMinutes = Math.max(
  1,
  Number.parseInt(process.env.MIDTRANS_EXPIRY_MINUTES || '2', 10) || 2
);

const midtransAxios = axios.create({
  baseURL: isProduction
    ? 'https://api.midtrans.com'
    : 'https://api.sandbox.midtrans.com',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${midtransServerKey}:`).toString('base64')}`,
  },
});

export interface MidtransChargeRequest {
  orderId: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export type MidtransPaymentMethod = 'qris' | 'va';

export type VABank =
  | 'bca'
  | 'bri'
  | 'bni'
  | 'permata'
  | 'cimb'
  | 'mandiri_bill';

interface MidtransChargeResponse {
  order_id: string;
  transaction_id: string;
  transaction_status: string;
  gross_amount: string;
  expiry_time?: string;
  actions?: Array<{ name: string; url: string; method: string }>;
  va_numbers?: Array<{ bank: string; va_number: string }>;
  permata_va_number?: string;
  biller_code?: string;
  bill_key?: string;
  payment_type?: string;
  [key: string]: unknown;
}

function getMidtransAxiosErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const responseData = error.response?.data;
  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === 'object') {
    const statusMessage = (responseData as Record<string, unknown>).status_message;
    if (typeof statusMessage === 'string' && statusMessage.trim()) {
      return statusMessage;
    }

    const message = (responseData as Record<string, unknown>).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    return JSON.stringify(responseData);
  }

  return error.message || fallback;
}

function extractQrCodeUrl(response: MidtransChargeResponse) {
  const action = response.actions?.find(
    (item) => item.name === 'generate-qr-code' || item.url.toLowerCase().includes('qr')
  );
  return action?.url || null;
}

function extractVaInfo(response: MidtransChargeResponse) {
  if (response.permata_va_number) {
    return {
      bankCode: 'permata',
      vaNumber: response.permata_va_number,
      billerCode: null,
      billKey: null,
    };
  }

  const firstVa = response.va_numbers?.[0];

  if (response.biller_code || response.bill_key || response.payment_type === 'echannel') {
    return {
      bankCode: 'mandiri_bill',
      vaNumber: null,
      billerCode: response.biller_code || null,
      billKey: response.bill_key || null,
    };
  }

  return {
    bankCode: firstVa?.bank || null,
    vaNumber: firstVa?.va_number || null,
    billerCode: null,
    billKey: null,
  };
}

export async function createQrisCharge(request: MidtransChargeRequest) {
  try {
    const payload = {
      payment_type: 'qris',
      transaction_details: {
        order_id: request.orderId,
        gross_amount: Math.round(request.amount),
      },
      qris: {
        acquirer: 'gopay',
      },
      customer_details: {
        first_name: request.customerName || 'Customer',
        email: request.customerEmail || undefined,
        phone: request.customerPhone || undefined,
      },
      custom_expiry: {
        expiry_duration: midtransExpiryMinutes,
        unit: 'minute',
      },
      metadata: {
        description: request.description || `Payment - ${request.orderId}`,
        ...(request.metadata || {}),
      },
    };

    const response = await midtransAxios.post<MidtransChargeResponse>('/v2/charge', payload);
    const qrCodeUrl = extractQrCodeUrl(response.data);

    return {
      success: true,
      transactionId: response.data.transaction_id,
      orderId: response.data.order_id,
      amount: Number(response.data.gross_amount),
      expiryTime: response.data.expiry_time || null,
      status: response.data.transaction_status,
      paymentType: 'qris',
      qrCodeUrl,
      rawResponse: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = getMidtransAxiosErrorMessage(error, 'Unknown Midtrans error');
      throw new Error(`Failed to create Midtrans QRIS charge: ${message}`);
    }
    throw new Error(
      `Failed to create Midtrans QRIS charge: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function createVaCharge(request: MidtransChargeRequest, bank: VABank) {
  try {
    const basePayload = {
      transaction_details: {
        order_id: request.orderId,
        gross_amount: Math.round(request.amount),
      },
      customer_details: {
        first_name: request.customerName || 'Customer',
        email: request.customerEmail || undefined,
        phone: request.customerPhone || undefined,
      },
      custom_expiry: {
        expiry_duration: midtransExpiryMinutes,
        unit: 'minute',
      },
      metadata: {
        description: request.description || `Payment - ${request.orderId}`,
        ...(request.metadata || {}),
      },
    };

    const payload =
      bank === 'mandiri_bill'
        ? {
            ...basePayload,
            payment_type: 'echannel',
            echannel: {
              bill_info1: 'Payment For',
              bill_info2: request.description || `Payment - ${request.orderId}`,
            },
          }
        : {
            ...basePayload,
            payment_type: 'bank_transfer',
            bank_transfer:
              bank === 'permata'
                ? { bank: 'permata' }
                : {
                    bank,
                  },
          };

    const response = await midtransAxios.post<MidtransChargeResponse>('/v2/charge', payload);
    const { vaNumber, billerCode, billKey } = extractVaInfo(response.data);

    return {
      success: true,
      transactionId: response.data.transaction_id,
      orderId: response.data.order_id,
      amount: Number(response.data.gross_amount),
      expiryTime: response.data.expiry_time || null,
      status: response.data.transaction_status,
      paymentType: 'va',
      bankCode: bank,
      vaNumber,
      billerCode,
      billKey,
      rawResponse: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = getMidtransAxiosErrorMessage(error, 'Unknown Midtrans error');
      throw new Error(`Failed to create Midtrans VA charge: ${message}`);
    }
    throw new Error(
      `Failed to create Midtrans VA charge: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getTransactionStatus(orderId: string) {
  try {
    const response = await midtransAxios.get<MidtransChargeResponse>(`/v2/${orderId}/status`);
    const qrCodeUrl = extractQrCodeUrl(response.data);
    const vaInfo = extractVaInfo(response.data);

    return {
      success: true,
      orderId: response.data.order_id,
      transactionId: response.data.transaction_id,
      status: response.data.transaction_status,
      amount: Number(response.data.gross_amount || 0),
      expiryTime: response.data.expiry_time || null,
      paymentType: response.data.payment_type || null,
      qrCodeUrl,
      bankCode: vaInfo.bankCode,
      vaNumber: vaInfo.vaNumber,
      billerCode: vaInfo.billerCode,
      billKey: vaInfo.billKey,
      rawResponse: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = getMidtransAxiosErrorMessage(error, 'Unknown Midtrans error');
      throw new Error(`Failed to check Midtrans transaction status: ${message}`);
    }
    throw new Error(
      `Failed to check Midtrans transaction status: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function simulateTransactionSettlement(orderId: string) {
  try {
    const response = await midtransAxios.post(`/v2/${orderId}/simulate`, {
      status: 'settlement',
    });

    return {
      success: true,
      rawResponse: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = getMidtransAxiosErrorMessage(error, 'Unknown Midtrans error');
      throw new Error(`Failed to simulate Midtrans transaction: ${message}`);
    }
    throw new Error(
      `Failed to simulate Midtrans transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function mapMidtransStatus(
  status: string
): 'PENDING' | 'SETTLEMENT' | 'EXPIRE' | 'FAILURE' {
  if (['settlement', 'capture'].includes(status)) {
    return 'SETTLEMENT';
  }

  if (status === 'pending') {
    return 'PENDING';
  }

  if (status === 'expire') {
    return 'EXPIRE';
  }

  if (
    ['deny', 'cancel', 'failure', 'refund', 'partial_refund', 'chargeback'].includes(status)
  ) {
    return 'FAILURE';
  }

  return 'PENDING';
}

export function verifyMidtransSignature(payload: Record<string, unknown>) {
  const orderId = String(payload.order_id || '');
  const statusCode = String(payload.status_code || '');
  const grossAmount = String(payload.gross_amount || '');
  const signatureKey = String(payload.signature_key || '');

  if (!orderId || !statusCode || !grossAmount || !signatureKey || !midtransServerKey) {
    return false;
  }

  const raw = `${orderId}${statusCode}${grossAmount}${midtransServerKey}`;
  const expected = crypto.createHash('sha512').update(raw).digest('hex');

  return expected === signatureKey;
}

export function getMidtransSimulatorLink(
  paymentMethod: MidtransPaymentMethod,
  vaBank?: VABank
) {
  if (paymentMethod === 'qris') {
    return 'https://simulator.sandbox.midtrans.com/v2/qris/index';
  }

  switch (vaBank) {
    case 'bca':
      return 'https://simulator.sandbox.midtrans.com/bca/va/index';
    case 'bni':
      return 'https://simulator.sandbox.midtrans.com/bni/va/index';
    case 'bri':
      return 'https://simulator.sandbox.midtrans.com/openapi/va/index?bank=bri';
    case 'permata':
      return 'https://simulator.sandbox.midtrans.com/openapi/va/index?bank=permata';
    case 'cimb':
      return 'https://simulator.sandbox.midtrans.com/openapi/va/index?bank=cimb';
    case 'mandiri_bill':
      return 'https://simulator.sandbox.midtrans.com/openapi/va/index?bank=mandiri';
    default:
      return 'https://simulator.sandbox.midtrans.com/';
  }
}
