import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* Header */}
      <header className="px-8 py-6" style={{ borderBottom: '1px solid var(--border-light)' }}>
        <Link href="/" className="heading-section text-xl" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
          Luxe Pay
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Success icon */}
          <div
            className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
            style={{ background: 'var(--success-light)' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p className="text-label mb-4" style={{ color: 'var(--success)' }}>Order Confirmed</p>
          <h1 className="heading-display text-3xl mb-4">Thank you for your purchase</h1>
          <p className="text-body mb-10">
            Your payment has been processed successfully.
            You will receive a confirmation shortly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/history" className="btn-primary">
              View Orders
            </Link>
            <Link href="/products" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
