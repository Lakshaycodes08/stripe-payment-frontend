'use client';

import { Suspense, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { api, USER_ID } from '../../src/lib/api';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const stripePromise = loadStripe('pk_test_51T57xwKejeCKO47RcwtK6aKBHJ1FzvIBgCOjXNFUDlkQVxaZy5v1WUa4yJ2Lb0Ksw3q9xPFzV5tfLGKJi5FzAO7400Kqx7RGew');

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'var(--success-light)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="heading-section text-2xl mb-3">Payment Successful</h2>
        <p className="text-body mb-8">
          Your order has been confirmed and is being processed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/history" className="btn-primary">View Orders</Link>
          <Link href="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Order Summary */}
      <div
        className="flex justify-between items-center p-5 mb-8"
        style={{
          background: 'var(--accent-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(184, 150, 90, 0.12)',
        }}
      >
        <span className="text-label" style={{ color: 'var(--accent-dark)' }}>Amount Due</span>
        <span className="heading-section text-xl" style={{ color: 'var(--accent-dark)' }}>
          {formatPrice(amount)}
        </span>
      </div>

      {/* Card Input */}
      <div className="mb-8">
        <label className="text-label block mb-3">Payment Details</label>
        <div className="stripe-element-container">
          <PaymentElement />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="toast-error mb-6 animate-fade-in">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-accent w-full"
        style={{ padding: '1.125rem 2rem', fontSize: '1rem' }}
      >
        {loading ? 'Processing...' : `Pay ${formatPrice(amount)}`}
      </button>

      {/* Test Info */}
      <div className="toast-info mt-6" style={{ fontSize: '0.8125rem' }}>
        <p className="font-medium mb-1">Test Mode</p>
        <p style={{ color: 'var(--text-secondary)' }}>
          Card: 4242 4242 4242 4242 &middot; Exp: 12/28 &middot; CVC: 123
        </p>
      </div>
    </form>
  );
}

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const cartId = searchParams.get('cart_id');
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cartId) {
      createPaymentIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId]);

  async function createPaymentIntent() {
    try {
      const response = await api.post('/payments', {
        user_id: USER_ID,
        cart_id: parseInt(cartId!),
      });
      setClientSecret(response.data.data.client_secret);
      setAmount(response.data.data.payment.amount);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="animate-pulse-subtle" style={{ color: 'var(--text-tertiary)' }}>
            Preparing your checkout...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        <header className="px-8 py-6" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <Link href="/" className="heading-section text-xl link">Luxe Pay</Link>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'var(--error-light)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h2 className="heading-section text-xl mb-3">Unable to proceed</h2>
            <p className="text-body mb-6">{error}</p>
            <Link href="/cart" className="btn-secondary">
              Return to Cart
            </Link>
          </div>
        </div>
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
        <Link href="/cart" className="link text-sm">
          Back to Cart
        </Link>
      </header>

      <div className="max-w-md mx-auto px-8 py-12">

        {/* Title */}
        <div className="mb-10">
          <p className="text-label mb-3" style={{ color: 'var(--accent)' }}>Secure Checkout</p>
          <h1 className="heading-display text-3xl">Complete Payment</h1>
        </div>

        {/* Form Card */}
        <div className="card-elevated p-8 animate-fade-in">
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'flat',
                  variables: {
                    colorPrimary: '#b8965a',
                    colorBackground: '#ffffff',
                    colorText: '#1a1a1a',
                    colorTextSecondary: '#6b6560',
                    colorDanger: '#9e3b3b',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSizeBase: '0.9375rem',
                    borderRadius: '10px',
                    spacingUnit: '4px',
                  },
                  rules: {
                    '.Input': {
                      border: '1px solid #eae6df',
                      boxShadow: 'none',
                      padding: '12px 14px',
                    },
                    '.Input:focus': {
                      border: '1px solid #b8965a',
                      boxShadow: '0 0 0 1px #b8965a',
                    },
                    '.Label': {
                      fontWeight: '500',
                      fontSize: '0.8125rem',
                      letterSpacing: '0.02em',
                      color: '#6b6560',
                    },
                  },
                },
              }}
            >
              <CheckoutForm amount={amount} />
            </Elements>
          )}
        </div>

        {/* Security Note */}
        <p className="text-center mt-8 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1" style={{ verticalAlign: '-1px' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          256-bit SSL encrypted &middot; PCI DSS compliant
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
          <p className="animate-pulse-subtle" style={{ color: 'var(--text-tertiary)' }}>
            Preparing your checkout...
          </p>
        </div>
      }
    >
      <CheckoutPageInner />
    </Suspense>
  );
}
