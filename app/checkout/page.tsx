'use client';

import { useEffect, useState } from 'react';
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

// ============================================================
// Load Stripe with your publishable key
// This is safe to expose — it's meant to be public
// NEVER use your secret key here
// ============================================================
const stripePromise = loadStripe('pk_test_51T57xwKejeCKO47RcwtK6aKBHJ1FzvIBgCOjXNFUDlkQVxaZy5v1WUa4yJ2Lb0Ksw3q9xPFzV5tfLGKJi5FzAO7400Kqx7RGew');

// ============================================================
// CHECKOUT FORM
// This is the inner component that has access to Stripe hooks
// It must be inside <Elements> provider to work
// ============================================================
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

    // ============================================================
    // confirmPayment sends card details directly to Stripe
    // Card details NEVER touch our backend — Stripe handles it
    // This is PCI compliance — we never see raw card numbers
    // ============================================================
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
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-500 mb-6">
          Your order has been placed successfully.
        </p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(amount)}
          </span>
        </div>
      </div>

      {/* Stripe Card Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        {/* ============================================================
            PaymentElement renders Stripe's secure card input UI
            Card details go directly to Stripe — never to our server
            This is how Stripe maintains PCI compliance
            ============================================================ */}
        <div className="border rounded-lg p-3">
          <PaymentElement />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay ${formatPrice(amount)}`}
      </button>

      {/* Test Card Info */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
        <p className="font-semibold mb-1">Test Card Details:</p>
        <p>Card Number: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date (e.g. 12/28)</p>
        <p>CVC: Any 3 digits (e.g. 123)</p>
      </div>
    </form>
  );
}

// ============================================================
// CHECKOUT PAGE
// Outer component that:
// 1. Gets cart_id from URL params
// 2. Creates PaymentIntent on our backend
// 3. Wraps CheckoutForm in Stripe Elements provider
// ============================================================
export default function CheckoutPage() {
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
  }, [cartId]);

  async function createPaymentIntent() {
    try {
      // ============================================================
      // We only send user_id and cart_id
      // Amount is NEVER sent from frontend
      // Backend calculates it from DB
      // ============================================================
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Initializing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">❌ {error}</p>
        <Link href="/cart" className="text-blue-600 hover:underline">
          ← Back to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <Link href="/cart" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow p-6">
          {clientSecret && (
            // ============================================================
            // Elements provider gives all child components
            // access to Stripe instance and clientSecret
            // clientSecret links this UI to the specific PaymentIntent
            // ============================================================
            <Elements
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <CheckoutForm amount={amount} />
            </Elements>
          )}
        </div>

      </div>
    </div>
  );
}