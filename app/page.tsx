import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Stripe Payment Demo
        </h1>
        <p className="text-gray-600 mb-8">
          A full-stack payment integration built with Fastify + Next.js
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products" style={{backgroundColor: '#2563eb'}} className="text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-md">
            🛍️ View Products
          </Link>
          <Link href="/cart" style={{backgroundColor: '#7c3aed'}} className="text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-md">
            🛒 View Cart
          </Link>
          <Link href="/history" style={{backgroundColor: '#059669'}} className="text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-md">
            📜 Payment History
          </Link>
        </div>
      </div>
    </main>
  );
}