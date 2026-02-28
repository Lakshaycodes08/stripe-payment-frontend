'use client';

import { useEffect, useState } from 'react';
import { api, USER_ID } from '../../src/lib/api';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId: number) {
    setAddingToCart(productId);
    setMessage('');
    try {
      await api.post('/cart', {
        user_id: USER_ID,
        product_id: productId,
        quantity: 1,
      });
      setMessageType('success');
      setMessage('Added to cart successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setMessageType('error');
      setMessage(err.response?.data?.error || 'Failed to add item');
    } finally {
      setAddingToCart(null);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p className="animate-pulse-subtle" style={{ color: 'var(--text-tertiary)' }}>
          Loading collection...
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
        <div className="flex items-center gap-8">
          <Link href="/history" className="link text-sm">Orders</Link>
          <Link href="/cart" className="btn-primary" style={{ padding: '0.625rem 1.5rem', fontSize: '0.8125rem' }}>
            View Cart
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* Page Title */}
        <div className="mb-12">
          <p className="text-label mb-3" style={{ color: 'var(--accent)' }}>Our Collection</p>
          <h1 className="heading-display text-4xl">Products</h1>
        </div>

        {/* Toast Message */}
        {message && (
          <div className={`mb-8 animate-fade-in ${messageType === 'success' ? 'toast-success' : 'toast-error'}`}>
            {message}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`card p-8 flex flex-col animate-fade-in-up delay-${index + 1}`}
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              {/* Product image placeholder */}
              <div
                className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <span className="text-3xl" style={{ color: 'var(--border-medium)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </span>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h2 className="heading-section text-lg mb-2">{product.name}</h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                  {product.description}
                </p>
              </div>

              {/* Price & Stock */}
              <div className="flex justify-between items-end mb-6">
                <span className="heading-section text-2xl" style={{ color: 'var(--accent-dark)' }}>
                  {formatPrice(product.price)}
                </span>
                <span className="text-label" style={{ fontSize: '0.6875rem' }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product.id)}
                disabled={addingToCart === product.id || product.stock === 0}
                className="btn-primary w-full"
              >
                {addingToCart === product.id ? 'Adding...' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
