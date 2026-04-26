'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { useDonationStore } from '@/hooks/donationStore';
import { PaymentMethod, VABank, TransactionType } from '@/types/donation';
import DonorDashboard_DonorNavbar from '@/components/ui/donor-dashboard/donor_navbar';

const DONATION_STEPS = [
  { id: 1, label: 'Select Amount' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Confirmation' },
] as const;

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000];

const formatIdr = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('Rp', 'Rp ');

export default function DonateFormPage({
  searchParams
}: {
  searchParams: Promise<{ type?: 'donation' | 'repayment'; referenceId?: string }>;
}) {
  
  const router = useRouter();
  const { data: session, status } = useSession();
  const params = use(searchParams);
  const paymentMethod = useDonationStore((state) => (state.donation?.payment_method))
  const vaBank = useDonationStore((state) => (state.donation?.va_bank))
  const amount = useDonationStore((state) => (state.donation?.amount))
  const setAmount = useDonationStore((state) => (state.setAmount))
  const setPaymentMethod = useDonationStore((state) => (state.setPaymentMethod))
  const setVaBank = useDonationStore((state) => (state.setVABank))
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const transactionType: TransactionType = (params.type as TransactionType) || 'donation';
  const referenceId =
    params.referenceId || (transactionType === 'donation' ? session?.user?.id || '' : '');

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(String(method));
    setError('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
    setError('');
  };

  const handleSubmit = async () => {
    setError('');

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (!amount || parseFloat(String(amount)) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'qris' && parseFloat(String(amount)) < 1500) {
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
          amount: parseFloat(String(amount)),
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
        amount: String(amount),
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

  const activeStep = 1;

  return (
    <div className="min-h-screen bg-[#F3F5F7]">
      <DonorDashboard_DonorNavbar />

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="text-center">
          <h1 className="text-[2.1rem] font-semibold leading-none tracking-tight text-[#111827] md:text-[2.5rem]">
            Make a <span className="text-[#07B0C8]">Donation</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-[#6B7280] md:text-[15px]">
            Your generosity empowers students with interest-free loans and scholarships.
          </p>
        </div>

        {/* main content container */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_3px_10px_-8px_rgba(17,24,39,0.18)] md:p-6">

          {/* donation progress */}
          <div className="mb-7">
            <div className="relative grid grid-cols-3">
              <div className="absolute left-[16.67%] right-[16.67%] top-4 h-px bg-[#DCE3EA]" />

              {DONATION_STEPS.map((step) => {
                const isActive = step.id === activeStep;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[18px] font-medium ${isActive ? 'bg-[#07B0C8] text-white shadow-[0_6px_14px_-10px_rgba(7,176,200,0.9)]' : 'border border-[#DCE3EA] bg-[#EEF3F7] text-[#9CA9BA]'}`}
                    >
                      {step.id}
                    </div>
                    <p
                      className={`text-center text-[15px] ${isActive ? 'font-medium text-[#07B0C8]' : 'font-normal text-[#8FA0B6]'}`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Reference ID Warning */}
          {!referenceId && status !== 'loading' && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-900">
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

        {/* select amount section */}
        <div className="space-y-4">

          {/* title + idr */}
          <div className='flex items-center justify-between'>

            {/* title */}
            <div className='text-sm font-medium text-gray-700'>
              Pilih jumlah yang diiginkan
            </div>

            {/* idr */}
            <div className='text-sm font-medium text-gray-700'>
              IDR
            </div>

          </div>

          {/* instant choices section */}
          <div className='grid grid-cols-2 gap-2'>
            {QUICK_AMOUNTS.map((quickAmount) => {
              const isSelected = amount === quickAmount;

              return (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount)}
                  className={`rounded-xl border p-2.5 text-[13px] font-medium transition ${isSelected ? 'border-[#07B0C8] bg-[#07B0C8]/10 text-[#06A3B9]' : 'border-gray-300/80 text-gray-700 hover:border-[#07B0C8]/45 hover:bg-[#F0FBFD]'}`}
                >
                  {formatIdr(quickAmount)}
                </button>
              );
            })}
          </div>

          {/* manual input section */}
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

        </div>

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
          <Link href="/donor/dashboard" className="text-sm text-[#07B0C8] hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
      </main>
    </div>
  );
}
