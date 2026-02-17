# Simple Store

A simple e-commerce storefront built with Next.js, featuring product listing, product detail (with modal/sheet), and cart with persistent state.

## 1. Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Install dependencies

```bash
npm install
# or
bun install
# or
yarn install
# or
pnpm install
```

### Run the application

Development server (default port 3000):

```bash
npm run dev
# or
bun run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To run on a specific port (e.g. 3000):

```bash
npm run dev -- -p 3000
# or
bun run dev -- -p 3000
```

Build for production:

```bash
npm run build
npm run start
```

---

## 2. Techniques and Architectures

### Slot technique for Parallel Routes + Intercepting Routes

- **Parallel Routes** are implemented with a **slot** (`@products`) so the product list and product detail can be rendered in parallel.
- **Intercepting routes** (`(.)products/[id]`) are used when navigating from the list (e.g. clicking a product): the detail is shown in a **modal** (or sheet on mobile) instead of a full page, while the URL still updates.
- Benefits: keeps **SEO** (direct URLs, metadata), **dynamic URLs**, and **custom metadata** for the detail page, without forcing the product list to re-fetch on every layout load. The trade-off is a more involved routing structure (slots + intercepting routes + `default.tsx`).

### Shadcn-style UI

- UI is built with **Radix primitives** (Dialog, Slot, etc.) and a **local component set** (no npm `shadcn` package). Components live in the repo and can be **customized directly** (e.g. `components/ui/`, `components/product-detail-modal.tsx`).

### State management: Zustand

- **Zustand** is used for global state: small bundle, used as hooks, straightforward API.
- **Cart** logic lives in `store/cart.ts`: add, update quantity, remove, and total. The store uses **persist** middleware with **localStorage** so the cart survives reloads.

### Styling: Tailwind

- **Tailwind** with the default config. Extra **animations** are added (e.g. via `tw-animate-css` or custom keyframes) so **`animate-*`** classes work for:
  - Product detail **Dialog** (modal)
  - **Cart Sheet** on mobile

---

## 3. Misc / Notes / Known Issues

### SEO and detail page

- Detail page is set up for **SSR** and **metadata** (title, description, etc.). **Core Web Vitals** have not been measured or optimized yet.

### Vercel and Intercepting Routes

- On **Vercel**, intercepting routes with the `(.)products` segment can fail when links are **prefetched**. Fix: set **`prefetch={false}`** on the `Link` that goes to the product detail (e.g. in the product list item) so interception works correctly.

### Fakestoreapi.com and SSR

- **fakestoreapi.com** can **challenge or reject** requests when called from **Vercel** during **SSR** (e.g. on direct load of a product detail page). A practical workaround is to put a **Cloudflare Worker** in front of it and use that as a **reverse proxy** to fakestoreapi.com, then point the app’s API base URL to the worker so SSR requests succeed.

### Cart: confirm before removing

- When the user decreases an item’s quantity to **0**, the app asks for **confirmation** before removing that item from the cart (avoids accidental removal).
