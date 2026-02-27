'use client';

import { useEffect, useState } from 'react';
import { api, USER_ID } from '../../src/lib/api';
import Link from 'next/link';

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  stripe_payment_intent_id: string;
}

export default function HistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await api.get(`/payments/history/${USER_ID}`);
      setPayments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-700';
      case 'pending':   return 'bg-yellow-100 text-yellow-700';
      case 'failed':    return 'bg-red-100 text-red-700';
      default:          return 'bg-gray-100 text-gray-700';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading payment history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            ← Shop More
          </Link>
        </div>

        {/* Empty State */}
        {payments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No payments yet</p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex justify-between items-start">

                  {/* Left Side */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {formatDate(payment.created_at)}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {payment.stripe_payment_intent_id}
                    </p>
                  </div>

                  {/* Right Side */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 mb-2">
                      {formatPrice(payment.amount)}
                    </p>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}