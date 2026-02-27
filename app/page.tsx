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
          <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            View Products
          </Link>
          <Link href="/cart" className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900">
            View Cart
          </Link>
        </div>
      </div>
    </main>
  );
}
