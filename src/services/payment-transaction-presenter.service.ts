import type { PaymentTransaction } from '@/generated/prisma';
import { getMidtransSimulatorLink, type VABank } from '@/services/midtrans.service';

type MidtransStoredResponse = {
  transaction_id?: string;
  transaction_status?: string;
  expiry_time?: string;
  payment_type?: string;
  actions?: Array<{ name?: string; url?: string }>;
  va_numbers?: Array<{ bank?: string; va_number?: string }>;
  permata_va_number?: string;
  biller_code?: string;
  bill_key?: string;
  [key: string]: unknown;
};

function extractQrCodeUrl(response: MidtransStoredResponse) {
  const action = response.actions?.find((item) => {
    const name = (item.name || '').toLowerCase();
    const url = (item.url || '').toLowerCase();
    return name === 'generate-qr-code' || url.includes('qr');
  });

  return action?.url || null;
}

function extractVaDetails(response: MidtransStoredResponse) {
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

export function buildPaymentTransactionDetail(paymentTransaction: PaymentTransaction) {
  const rawResponse = (paymentTransaction.response || {}) as MidtransStoredResponse;
  const qrisUrl = extractQrCodeUrl(rawResponse);
  const va = extractVaDetails(rawResponse);
  const vaBank = (va.bankCode || undefined) as VABank | undefined;

  return {
    orderId: paymentTransaction.externalId,
    transactionId: rawResponse.transaction_id || null,
    status: paymentTransaction.status,
    rawMidtransStatus: rawResponse.transaction_status || null,
    amount: Number(paymentTransaction.amount),
    expiryTime: rawResponse.expiry_time || null,
    paymentType: paymentTransaction.paymentType,
    qris: {
      qrCodeImageUrl: qrisUrl,
    },
    va: {
      bankCode: va.bankCode,
      vaNumber: va.vaNumber,
      billerCode: va.billerCode,
      billKey: va.billKey,
    },
    simulator: {
      url:
        paymentTransaction.paymentType === 'qris'
          ? getMidtransSimulatorLink('qris')
          : getMidtransSimulatorLink('va', vaBank),
    },
  };
}
