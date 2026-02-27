# Stripe Payment Frontend

A production-style payment frontend built with Next.js and TypeScript, integrated with a Fastify backend and Stripe Elements for secure card collection.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Payment UI**: Stripe Elements (@stripe/react-stripe-js)

## Project Structure
```
app/
├── page.tsx              # Home page
├── products/
│   └── page.tsx          # Product listing + Add to Cart
├── cart/
│   └── page.tsx          # Cart view + Proceed to Checkout
├── checkout/
│   ├── page.tsx          # Stripe Elements checkout
│   └── success/
│       └── page.tsx      # Payment success page
└── history/
    └── page.tsx          # Payment history
src/
└── lib/
    └── api.ts            # Axios instance + constants
```

## Features

- ✅ Browse products
- ✅ Add to cart
- ✅ View cart with total
- ✅ Stripe Elements card input (PCI compliant)
- ✅ Real-time payment processing
- ✅ Payment success confirmation
- ✅ Payment history view

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page |
| Products | `/products` | Browse and add to cart |
| Cart | `/cart` | View cart and checkout |
| Checkout | `/checkout?cart_id=1` | Enter card and pay |
| Success | `/checkout/success` | Payment confirmed |
| History | `/history` | Past payments |

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/Lakshaycodes08/stripe-payment-frontend.git
cd stripe-payment-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### 4. Start the frontend
```bash
npm run dev -- -p 3001
```

### 5. Make sure backend is running
```
http://localhost:3000
```

## Test Card
```
Card Number: 4242 4242 4242 4242
Expiry:      12/28
CVC:         123
```

## Key Decisions

### Why Next.js App Router?
App Router allows mixing Server and Client components. Pages with hooks use `'use client'` directive. Static pages render on the server by default.

### Why Axios instance?
Centralizing the base URL and headers in `src/lib/api.ts` means every component uses the same configuration without repeating it.

### Why never send amount from frontend?
The backend always calculates the total from the database. Frontend only sends `user_id` and `cart_id`. This prevents price manipulation.

### Why Stripe Elements?
Card details go directly from the browser to Stripe — never touching our backend. This is how PCI compliance is maintained.

## Author

Lakshay — [GitHub](https://github.com/Lakshaycodes08)