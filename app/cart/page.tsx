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
    // Pass cart_id to checkout page via URL
    router.push(`/checkout?cart_id=${cart.id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <Link
            href="/products"
            className="text-blue-600 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow mb-6">
          {cart.items.map((item, index) => (
            <div
              key={item.id}
              className={`flex justify-between items-center p-4 ${
                index !== cart.items.length - 1 ? 'border-b' : ''
              }`}
            >
              <div>
                <p className="font-semibold text-gray-900">{item.product_name}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.unit_price)} × {item.quantity}
                </p>
              </div>
              <p className="font-bold text-gray-900">
                {formatPrice(item.unit_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-gray-900">Total</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(cart.total)}
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        {cart.status === 'active' ? (
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700"
          >
            Proceed to Checkout →
          </button>
        ) : (
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-green-600 font-semibold">
              ✅ This cart has been checked out
            </p>
            <Link
              href="/products"
              className="text-blue-600 hover:underline text-sm mt-2 block"
            >
              Shop again
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
