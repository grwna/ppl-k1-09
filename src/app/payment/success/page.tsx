'use client';

import Link from 'next/link';
import localFont from 'next/font/local';

const plusJakartaSansFont = localFont({
  src: '../../../../public/fonts/PlusJakartaSans-VariableFont.ttf',
  display: 'swap',
});

export default function PaymentSuccessPage() {
  return (
    <div className={`${plusJakartaSansFont.className} min-h-screen bg-gradient-to-br from-[#07B0C8]/10 to-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8 flex items-center`}>
      <div className="max-w-md mx-auto w-full">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-[#07B0C8]/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#07B0C8]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Link
              href="/"
              className="block w-full px-4 py-2 bg-[#07B0C8] text-white rounded-md hover:bg-[#059BB0] font-medium transition"
            >
              Back to Home
            </Link>
            <Link
              href="/dashboard"
              className="block w-full px-4 py-2 bg-[#F9FAFB] text-[#07B0C8] border border-[#07B0C8] rounded-md hover:bg-[#07B0C8]/5 font-medium transition"
            >
              View Dashboard
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-6">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
