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
      setMessage('✅ Added to cart!');
   } catch (error: unknown) {
  const err = error as { response?: { data?: { error?: string } } };
  setMessage('❌ ' + (err.response?.data?.error || 'Failed to add'));
} finally {
  setAddingToCart(null);
  setTimeout(() => setMessage(''), 2000);
}
  }

  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link
            href="/cart"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            View Cart →
          </Link>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-white rounded-lg shadow text-center">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-6 flex flex-col"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-500 text-sm mb-4 flex-1">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
              <button
                onClick={() => addToCart(product.id)}
                disabled={addingToCart === product.id || product.stock === 0}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}