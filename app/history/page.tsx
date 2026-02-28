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
      month: 'long',
      day: 'numeric',
    });
  }

  function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusBadge(status: string): string {
    switch (status) {
      case 'succeeded': return 'badge-success';
      case 'pending':   return 'badge-warning';
      case 'failed':    return 'badge-error';
      default:          return 'badge-warning';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p className="animate-pulse-subtle" style={{ color: 'var(--text-tertiary)' }}>
          Loading order history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* Header */}
      <header
        className="px-8 py-6 flex justify-between items-center"
        style={{ borderBottom: '1px solid var(--border-light)' }}
      >
        <Link href="/" className="heading-section text-xl link">Luxe Pay</Link>
        <Link href="/products" className="link text-sm">
          Browse Collection
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-12">

        {/* Title */}
        <div className="mb-10">
          <p className="text-label mb-3" style={{ color: 'var(--accent)' }}>Account</p>
          <h1 className="heading-display text-4xl">Order History</h1>
        </div>

        {/* Empty State */}
        {payments.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-body mb-2">No orders yet</p>
            <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
              Your purchase history will appear here.
            </p>
            <Link href="/products" className="btn-accent">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <div
                key={payment.id}
                className={`card p-6 sm:p-8 animate-fade-in delay-${Math.min(index + 1, 6)}`}
                style={{ opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                  {/* Left — Date & ID */}
                  <div>
                    <p className="font-medium mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      {formatDate(payment.created_at)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono, monospace)' }}>
                      {payment.stripe_payment_intent_id}
                    </p>
                  </div>

                  {/* Right — Amount & Status */}
                  <div className="flex items-center gap-5">
                    <span className={`badge ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                    <span className="heading-section text-xl" style={{ minWidth: '80px', textAlign: 'right' }}>
                      {formatPrice(payment.amount)}
                    </span>
                  </div>

                </div>

                {/* Timestamp */}
                <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>
                  {formatTime(payment.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
