'use client';

import { useState, use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import localFont from 'next/font/local';

const plusJakartaSansFont = localFont({
  src: '../../../../public/fonts/PlusJakartaSans-VariableFont.ttf',
  display: 'swap',
});

export default function PaymentConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{
    transactionId?: string;
    orderId?: string;
    amount?: string;
    transactionType?: string;
    paymentMethod?: string;
    qrCodeUrl?: string;
    invoiceUrl?: string;
    bankAccountNumber?: string;
    bankCode?: string;
  }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const [status, setStatus] = useState<'PENDING' | 'SETTLEMENT' | 'EXPIRE' | 'FAILURE' | null>(null);
  const [loading, setLoading] = useState(true);
  const [pollingActive, setPollingActive] = useState(true);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  const transactionId = params.transactionId || '';
  const orderId = params.orderId || '';
  const amount = params.amount || '0';
  const transactionType = params.transactionType || 'donation';
  const paymentMethod = params.paymentMethod || 'qris';
  const qrCodeUrl = params.qrCodeUrl || '';
  const invoiceUrl = params.invoiceUrl || '';
  const bankAccountNumber = params.bankAccountNumber || '';
  const bankCode = params.bankCode || 'BCA';

  // Check payment status
  const checkStatus = async () => {
    if (!transactionId) {
      setError('Transaction ID is missing');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/payments/xendit/status/${transactionId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const data = await response.json();
      setStatus(data.status);

      // Stop polling if payment is settled or expired
      if (data.status === 'SETTLEMENT' || data.status === 'EXPIRE' || data.status === 'FAILURE') {
        setPollingActive(false);
      }
    } catch (err) {
      console.error('Status check error:', err);
      // Continue polling even on error
    } finally {
      setLoading(false);
    }
  };

  // Initial status check
  useEffect(() => {
    checkStatus();
  }, [transactionId]);

  // Poll for status updates every 5 seconds
  useEffect(() => {
    if (!pollingActive) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [pollingActive, transactionId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || !pollingActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, pollingActive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const getStatusColor = (s: string | null) => {
    switch (s) {
      case 'SETTLEMENT':
        return 'text-green-600 bg-green-50';
      case 'PENDING':
        return 'text-blue-600 bg-blue-50';
      case 'EXPIRE':
        return 'text-red-600 bg-red-50';
      case 'FAILURE':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (s: string | null) => {
    switch (s) {
      case 'SETTLEMENT':
        return '✓';
      case 'PENDING':
        return '⏳';
      case 'EXPIRE':
        return '✕';
      case 'FAILURE':
        return '✕';
      default:
        return '●';
    }
  };

  const getStatusLabel = (s: string | null) => {
    switch (s) {
      case 'SETTLEMENT':
        return 'PAID SUCCESSFULLY';
      default:
        return s || 'Loading';
    }
  };

  return (
    <div className={`${plusJakartaSansFont.className} min-h-screen bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Status Badge */}
          <div
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getStatusColor(
              status
            )}`}
          >
            {getStatusIcon(status)} {getStatusLabel(status)}
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#07B0C8] mb-2">Payment Confirmation</h1>
            <p className="text-gray-600">
              {transactionType === 'donation' ? 'Donation' : 'Loan Repayment'} - {paymentMethod === 'qris' ? 'QRIS Payment' : 'Bank Transfer'}
            </p>
          </div>

          {/* Payment Details */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Order ID</p>
              <p className="text-sm font-medium text-gray-900 break-all">{orderId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Transaction ID</p>
              <p className="text-sm font-medium text-gray-900 break-all">{transactionId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Amount</p>
              <p className="text-lg font-bold text-[#07B0C8]">{formatCurrency(amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Time Left</p>
              <p className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>

          {/* QRIS Payment Display */}
          {paymentMethod === 'qris' && (
            <div className="mb-6 p-4 bg-[#07B0C8]/10 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-4">QRIS Payment Instructions</h3>

              <ol className="space-y-2 text-sm text-gray-700 mb-4">
                <li>
                  <span className="font-medium">1. Click the payment link below</span> to open the Xendit payment page
                </li>
                <li>
                  <span className="font-medium">2. Scan the QR code</span> with your e-wallet (GoPay, OVO, Dana, LinkAja, etc.)
                </li>
                <li>
                  <span className="font-medium">3. Complete the payment</span> in your e-wallet app
                </li>
                <li>
                  <span className="font-medium">4. Payment status</span> will update automatically
                </li>
              </ol>

              {invoiceUrl && (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-[#07B0C8] text-white text-center rounded-md hover:bg-[#059BB0] font-medium transition"
                >
                  Open Payment Page & Scan QR Code →
                </a>
              )}
              {!invoiceUrl && (
                <div className="px-4 py-3 bg-gray-200 text-gray-600 text-center rounded-md">
                  Loading payment page...
                </div>
              )}
            </div>
          )}

          {/* Bank Transfer Payment Display */}
          {paymentMethod === 'bank_transfer' && (
            <div className="mb-6 p-4 bg-[#07B0C8]/10 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Bank Transfer Instructions</h3>

              <ol className="space-y-2 text-sm text-gray-700 mb-4">
                <li>
                  <span className="font-medium">1. Click the payment link below</span> to open the Xendit payment page
                </li>
                <li>
                  <span className="font-medium">2. View your virtual account number</span> for the selected bank
                </li>
                <li>
                  <span className="font-medium">3. Transfer the exact amount</span> shown in your bank app
                </li>
                <li>
                  <span className="font-medium">4. Payment status</span> will update automatically
                </li>
              </ol>

              {invoiceUrl && (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-[#07B0C8] text-white text-center rounded-md hover:bg-[#059BB0] font-medium transition"
                >
                  Open Payment Page & Get Account Number →
                </a>
              )}
              {!invoiceUrl && (
                <div className="px-4 py-3 bg-gray-200 text-gray-600 text-center rounded-md">
                  Loading payment page...
                </div>
              )}
            </div>
          )}

          {/* Status Messages */}
          {status === 'SETTLEMENT' && (
            <div className="mb-6 p-4 bg-[#07B0C8]/10 border border-[#07B0C8] rounded-lg">
              <p className="text-[#07B0C8] font-medium">✓ Payment Completed Successfully!</p>
              <p className="text-[#059BB0] text-sm mt-1">Your payment has been confirmed.</p>
            </div>
          )}

          {status === 'EXPIRE' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">✕ Payment Expired</p>
              <p className="text-red-600 text-sm mt-1">
                This payment request has expired. Please create a new payment.
              </p>
              <Link
                href="/payment"
                className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
              >
                Create New Payment
              </Link>
            </div>
          )}

          {status === 'FAILURE' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">✕ Payment Failed</p>
              <p className="text-red-600 text-sm mt-1">
                This payment has failed. Please try again with a new payment.
              </p>
              <Link
                href="/payment"
                className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
              >
                Retry Payment
              </Link>
            </div>
          )}

          {/* Polling Indicator */}
          {pollingActive && (
            <div className="text-center text-sm text-gray-500">
              <span className="inline-block">Checking payment status</span>
              <span className="inline-block ml-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>
                  ●
                </span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                  ●
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
