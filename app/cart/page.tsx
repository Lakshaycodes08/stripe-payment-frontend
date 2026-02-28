'use client';

import { useEffect, useState } from 'react';
import { api, USER_ID } from '../../src/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product_name: string;
}

interface Cart {
  id: number;
  user_id: number;
  status: string;
  items: CartItem[];
  total: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const response = await api.get(`/cart/${USER_ID}`);
      setCart(response.data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function handleCheckout() {
    if (!cart) return;
    router.push(`/checkout?cart_id=${cart.id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p className="animate-pulse-subtle" style={{ color: 'var(--text-tertiary)' }}>
          Loading cart...
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        <header className="px-8 py-6" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <Link href="/" className="heading-section text-xl link">Luxe Pay</Link>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center">
            <p className="text-label mb-3">Your Cart</p>
            <h1 className="heading-display text-3xl mb-4">Nothing here yet</h1>
            <p className="text-body mb-8">Start exploring our collection to add items.</p>
            <Link href="/products" className="btn-accent">
              Browse Collection
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
        <Link href="/products" className="link text-sm">
          Continue Shopping
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-12">

        {/* Page Title */}
        <div className="mb-10">
          <p className="text-label mb-3" style={{ color: 'var(--accent)' }}>Review</p>
          <h1 className="heading-display text-4xl">Your Cart</h1>
        </div>

        {/* Cart Items */}
        <div className="card-elevated overflow-hidden mb-8 animate-fade-in">
          {cart.items.map((item, index) => (
            <div key={item.id}>
              <div className="flex justify-between items-center px-8 py-6">
                <div>
                  <p className="font-medium mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    {item.product_name}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {formatPrice(item.unit_price)} &times; {item.quantity}
                  </p>
                </div>
                <p className="heading-section text-lg">
                  {formatPrice(item.unit_price * item.quantity)}
                </p>
              </div>
              {index !== cart.items.length - 1 && <hr className="divider mx-8" />}
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="flex justify-between items-center px-8 py-6 mb-8"
          style={{
            background: 'var(--accent-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(184, 150, 90, 0.12)',
          }}
        >
          <p className="text-label" style={{ color: 'var(--accent-dark)' }}>Total</p>
          <p className="heading-section text-2xl" style={{ color: 'var(--accent-dark)' }}>
            {formatPrice(cart.total)}
          </p>
        </div>

        {/* Checkout */}
        {cart.status === 'active' ? (
          <button onClick={handleCheckout} className="btn-accent w-full" style={{ padding: '1.125rem 2rem', fontSize: '1rem' }}>
            Proceed to Checkout
          </button>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="toast-success mb-4">
              This cart has been checked out successfully.
            </div>
            <Link href="/products" className="link text-sm">
              Start a new order
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
