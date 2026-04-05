import type { MidtransPaymentMethod, VABank } from '@/services/midtrans.service';

export type TransactionType = 'donation' | 'repayment';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_VA_BANKS: VABank[] = [
  'bca',
  'bri',
  'bni',
  'permata',
  'cimb',
  'mandiri_bill',
];

export interface AuthenticatedPaymentUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface CreatePaymentBody {
  amount: number;
  transactionType: TransactionType;
  paymentMethod: MidtransPaymentMethod;
  vaBank?: VABank;
  referenceId?: string;
  customer?: {
    userId?: string;
    email?: string;
    name?: string;
    phone?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface NormalizedPaymentRequest {
  amount: number;
  transactionType: TransactionType;
  paymentMethod: MidtransPaymentMethod;
  vaBank: VABank;
  referenceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  metadata?: Record<string, unknown>;
}

export function isUuid(value: string) {
  return UUID_REGEX.test(value);
}

export function normalizePaymentRequest(
  body: CreatePaymentBody,
  currentUser: AuthenticatedPaymentUser | null
):
  | { ok: true; data: NormalizedPaymentRequest }
  | { ok: false; error: string; status: number } {
  if (!currentUser) {
    return { ok: false, error: 'Unauthorized', status: 401 };
  }

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
    return { ok: false, error: 'Invalid amount', status: 400 };
  }

  if (!['donation', 'repayment'].includes(transactionType)) {
    return { ok: false, error: 'Invalid transaction type', status: 400 };
  }

  if (!['qris', 'va'].includes(paymentMethod)) {
    return { ok: false, error: 'Invalid payment method', status: 400 };
  }

  if (paymentMethod === 'qris' && Number(amount) < 1500) {
    return { ok: false, error: 'Minimum QRIS amount is IDR 1,500', status: 400 };
  }

  if (paymentMethod === 'va' && !ALLOWED_VA_BANKS.includes(vaBank)) {
    return { ok: false, error: 'Invalid VA bank', status: 400 };
  }

  if (customer?.userId && !isUuid(customer.userId.trim())) {
    return { ok: false, error: 'customer.userId must be a valid UUID', status: 400 };
  }

  const resolvedReferenceId =
    transactionType === 'donation' ? currentUser.id : referenceId?.trim();

  if (!resolvedReferenceId) {
    return { ok: false, error: 'referenceId is required', status: 400 };
  }

  if (!isUuid(resolvedReferenceId)) {
    return { ok: false, error: 'referenceId must be a valid UUID', status: 400 };
  }

  return {
    ok: true,
    data: {
      amount: Math.round(amount),
      transactionType,
      paymentMethod,
      vaBank,
      referenceId: resolvedReferenceId,
      customerName: currentUser.name || customer?.name || 'Customer',
      customerEmail: currentUser.email,
      customerPhone: customer?.phone,
      metadata: {
        transactionType,
        referenceId: resolvedReferenceId,
        paymentMethod,
        vaBank: paymentMethod === 'va' ? vaBank : null,
        customerUserId: currentUser.id,
        ...(metadata || {}),
      },
    },
  };
}

export async function validateRepaymentOwnership(params: {
  transactionType: TransactionType;
  referenceId: string;
  currentUserId: string;
  findLoanBorrowerId: (loanId: string) => Promise<string | null>;
}): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const { transactionType, referenceId, currentUserId, findLoanBorrowerId } = params;

  if (transactionType !== 'repayment') {
    return { ok: true };
  }

  const borrowerId = await findLoanBorrowerId(referenceId);

  if (!borrowerId) {
    return { ok: false, error: 'Loan not found', status: 404 };
  }

  if (borrowerId !== currentUserId) {
    return { ok: false, error: 'Forbidden', status: 403 };
  }

  return { ok: true };
}

export async function validatePaymentTransactionAccess(params: {
  category: 'DONATION' | 'REPAYMENT';
  referenceId: string;
  currentUserId: string;
  findLoanBorrowerId: (loanId: string) => Promise<string | null>;
}): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const { category, referenceId, currentUserId, findLoanBorrowerId } = params;

  if (category === 'DONATION') {
    return referenceId === currentUserId
      ? { ok: true }
      : { ok: false, error: 'Forbidden', status: 403 };
  }

  const borrowerId = await findLoanBorrowerId(referenceId);

  if (!borrowerId) {
    return { ok: false, error: 'Loan not found', status: 404 };
  }

  if (borrowerId !== currentUserId) {
    return { ok: false, error: 'Forbidden', status: 403 };
  }

  return { ok: true };
}
