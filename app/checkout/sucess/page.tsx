import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-500 mb-6">Your order has been placed.</p>
      <Link
        href="/products"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
