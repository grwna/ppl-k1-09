'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type PaymentMethod = 'qris' | 'va' | null;
type VABank =
  | 'bca'
  | 'bri'
  | 'bni'
  | 'permata'
  | 'cimb'
  | 'mandiri_bill';
type TransactionType = 'donation' | 'repayment';

export default function PaymentPage({
  searchParams
}: {
  searchParams: Promise<{ type?: 'donation' | 'repayment'; referenceId?: string }>;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const params = use(searchParams);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [vaBank, setVaBank] = useState<VABank>('bca');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const transactionType: TransactionType = (params.type as TransactionType) || 'donation';
  const referenceId =
    params.referenceId || (transactionType === 'donation' ? session?.user?.id || '' : '');

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setError('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'qris' && parseFloat(amount) < 1500) {
      setError('Minimum QRIS amount is IDR 1,500');
      return;
    }

    if (!referenceId) {
      setError('Reference ID is missing');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payments/midtrans/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          transactionType,
          referenceId,
          paymentMethod,
          vaBank: paymentMethod === 'va' ? vaBank : undefined,
          description: `${transactionType === 'donation' ? 'Donation via' : 'Loan Repayment via'} ${
            paymentMethod === 'qris' ? 'QRIS' : 'Virtual Account'
          }`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const data = await response.json();

      // Redirect to confirmation page
      const redirectUrl = new URLSearchParams({
        transactionId: data.transactionId,
        orderId: data.orderId,
        amount: amount,
        transactionType: transactionType,
        paymentMethod: paymentMethod,
        qrCodeUrl: data.qrCodeUrl || '',
        vaNumber: data.vaNumber || '',
        bankCode: data.bankCode || '',
        billerCode: data.billerCode || '',
        billKey: data.billKey || '',
        expiryTime: data.expiryTime || '',
      }).toString();

      router.push(`/payment/confirm?${redirectUrl}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#07B0C8]">Make Payment</h1>
          <p className="text-gray-600 mt-2">
            {transactionType === 'donation' ? 'Donate to help others' : 'Repay your loan'}
          </p>
        </div>

        {/* Missing Reference ID Warning */}
        {!referenceId && status !== 'loading' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-900 text-sm">
              <span className="font-medium">
                {transactionType === 'donation'
                  ? 'Unable to determine the donor account.'
                  : 'No reference ID found.'}
              </span>
              {transactionType === 'donation'
                ? ' Please sign in again before continuing.'
                : ' This payment still needs a repayment reference ID.'}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>

          {/* QRIS Option */}
          <div
            onClick={() => handlePaymentMethodSelect('qris')}
            className={`mb-3 p-4 border-2 rounded-lg cursor-pointer transition ${
              paymentMethod === 'qris'
                ? 'border-[#07B0C8] bg-[#07B0C8]/10'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 'qris' ? 'border-[#07B0C8] bg-[#07B0C8]' : 'border-gray-300'
                }`}
              >
                {paymentMethod === 'qris' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <p className="font-medium text-gray-900">QRIS (Any E-Wallet)</p>
                <p className="text-xs text-gray-500">GoPay, OVO, Dana, LinkAja, etc.</p>
              </div>
            </div>
          </div>

          {/* Bank Transfer Option */}
          <div
            onClick={() => handlePaymentMethodSelect('va')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              paymentMethod === 'va'
                ? 'border-[#07B0C8] bg-[#07B0C8]/10'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 'va'
                    ? 'border-[#07B0C8] bg-[#07B0C8]'
                    : 'border-gray-300'
                }`}
              >
                {paymentMethod === 'va' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">Virtual Account (VA)</p>
                <p className="text-xs text-gray-500">Pay to bank VA number from Midtrans</p>
              </div>
            </div>
          </div>
        </div>

        {paymentMethod === 'va' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">VA Bank</label>
            <select
              value={vaBank}
              onChange={(e) => setVaBank(e.target.value as VABank)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07B0C8]"
            >
              <option value="bca">BCA</option>
              <option value="bri">BRI</option>
              <option value="bni">BNI</option>
              <option value="permata">Permata</option>
              <option value="cimb">CIMB</option>
              <option value="mandiri_bill">Mandiri Bill</option>
            </select>
          </div>
        )}

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (IDR)
          </label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            min={paymentMethod === 'qris' ? '1500' : '1000'}
            step="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07B0C8]"
            disabled={!paymentMethod}
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum: {paymentMethod === 'qris' ? 'IDR 1,500 (QRIS)' : 'IDR 1,000'}
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !paymentMethod || !amount || !referenceId}
          className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${
            loading || !paymentMethod || !amount || !referenceId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#07B0C8] hover:bg-[#059BB0]'
          }`}
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-[#07B0C8] hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
