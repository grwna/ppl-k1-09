'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import localFont from 'next/font/local';

const plusJakartaSansFont = localFont({
  src: '../../../public/fonts/PlusJakartaSans-VariableFont.ttf',
  display: 'swap',
});

type TransactionType = 'donation' | 'repayment';

export default function PaymentTestPage() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<TransactionType>('donation');
  const [referenceId, setReferenceId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!referenceId.trim()) {
      setError('Please enter a Reference ID');
      return;
    }

    // Redirect to payment page with parameters
    router.push(`/payment?type=${transactionType}&referenceId=${encodeURIComponent(referenceId)}`);
  };

  const handleGenerateTestId = () => {
    // Generate a valid UUID v4 for testing
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    setReferenceId(uuid);
  };

  return (
    <div className={`${plusJakartaSansFont.className} min-h-screen bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#07B0C8]">Payment Test</h1>
            <p className="text-gray-600 text-sm mt-2">
              For testing the payment flow only
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Transaction Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transaction Type
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07B0C8]"
              >
                <option value="donation">Donation</option>
                <option value="repayment">Loan Repayment</option>
              </select>
            </div>

            {/* Reference ID */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="Enter or generate ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07B0C8]"
                />
                <button
                  type="button"
                  onClick={handleGenerateTestId}
                  className="px-4 py-2 bg-[#07B0C8] text-white rounded-md hover:bg-[#059BB0] font-medium"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use a valid UUID or generate one for testing
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!referenceId.trim()}
              className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${
                !referenceId.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#07B0C8] hover:bg-[#059BB0]'
              }`}
            >
              Proceed to Payment
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-[#07B0C8] hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
