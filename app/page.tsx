import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex justify-between items-center">
        <span className="heading-section text-xl">Luxe Pay</span>
        <div className="flex gap-8">
          <Link href="/products" className="link text-sm">Collection</Link>
          <Link href="/cart" className="link text-sm">Cart</Link>
          <Link href="/history" className="link text-sm">Orders</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <div className="text-center max-w-2xl animate-fade-in-up">

          {/* Overline */}
          <p className="text-label mb-6" style={{ color: 'var(--accent)' }}>
            Secure Payment Experience
          </p>

          {/* Main heading */}
          <h1
            className="heading-display mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            Effortless payments,{' '}
            <span style={{ color: 'var(--accent)' }}>beautifully</span>{' '}
            crafted.
          </h1>

          {/* Subtitle */}
          <p
            className="text-body text-lg mb-12 max-w-md mx-auto"
            style={{ lineHeight: 1.7 }}
          >
            A refined checkout experience built with precision.
            Powered by Stripe, designed for elegance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-accent">
              Browse Collection
            </Link>
            <Link href="/history" className="btn-secondary">
              View Orders
            </Link>
          </div>
        </div>

        {/* Decorative line */}
        <div
          className="mt-20 opacity-30"
          style={{
            width: '60px',
            height: '1px',
            background: 'var(--accent)',
          }}
        />
      </div>

      {/* Footer */}
      <footer className="px-8 py-6 flex justify-between items-center" style={{ borderTop: '1px solid var(--border-light)' }}>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Built with Next.js & Stripe
        </span>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          PCI Compliant
        </span>
      </footer>
    </main>
  );
}
