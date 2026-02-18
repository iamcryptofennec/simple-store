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

## 3. Testing

The project uses **Vitest** for **unit tests**. Tests run in **Node** (no browser or DOM) and cover pure logic: product filtering/grouping and cart store behavior.

### How to run tests

**Watch mode** (re-runs on file changes):

```bash
npm run test
```

**Single run** (e.g. for CI or a one-off check):

```bash
npm run test:run
```

### What’s covered

| Area | File | Description |
|------|------|-------------|
| **Product utils** | `utils/products.test.ts` | `filterProductsBySearch` and `groupProductsByCategory` from `utils/products.ts`. |
| **Cart store** | `store/cart.test.ts` | Cart actions and `cartTotal` from `store/cart.ts` (Zustand store). |

**Product utils (`utils/products.ts`)**

- **`filterProductsBySearch(products, searchQuery)`**
  - Empty or whitespace query returns all products.
  - Filters by **title** and **category** (case-insensitive).
  - Returns an empty array when there are no matches (or when the product list is empty).
- **`groupProductsByCategory(products)`**
  - Returns an empty object for an empty array.
  - Groups products by `category` into `Record<category, Product[]>`.
  - Handles a single category or multiple categories and preserves product fields.

**Cart store (`store/cart.ts`)**

- **`addToCart(product, quantity?)`**  
  New product adds a line; same product again increases quantity. Optional quantity is supported.
- **`updateQuantity(id, delta)`**  
  Increases or decreases quantity by `delta`. Does nothing if the item is missing or if the result would be ≤ 0.
- **`removeItem(id)`**  
  Removes the item by id; other items are unchanged.
- **`cartTotal()`**  
  Returns the sum of `price × quantity` for all items; 0 for an empty cart.
- **Persistent state**  
  The cart uses Zustand `persist` with `localStorage` (key `my-cart`). Tests run in a **jsdom** environment for this file so that persistence is exercised: after `addToCart`, `updateQuantity`, and `removeItem`, the tests assert that the serialized state in `localStorage` matches the store (partialized to `items` only, with the expected shape and version).

Tests reset cart state and `localStorage` between cases (e.g. `beforeEach` clearing items and the storage key) so suites stay independent. The config is in **`vitest.config.ts`** (Node environment, `@` path alias). Coverage output (if enabled) is ignored via `/coverage` in `.gitignore`.

---

## 4. Misc / Notes / Known Issues

### SEO and detail page

- Detail page is set up for **SSR** and **metadata** (title, description, etc.). **Core Web Vitals** have not been measured or optimized yet.

### Vercel and Intercepting Routes

- On **Vercel**, intercepting routes with the `(.)products` segment can fail when links are **prefetched**. Fix: set **`prefetch={false}`** on the `Link` that goes to the product detail (e.g. in the product list item) so interception works correctly.

### Fakestoreapi.com and SSR

- **fakestoreapi.com** can **challenge or reject** requests when called from **Vercel** during **SSR** (e.g. on direct load of a product detail page). A practical workaround is to put a **Cloudflare Worker** in front of it and use that as a **reverse proxy** to fakestoreapi.com, then point the app’s API base URL to the worker so SSR requests succeed.
- You can use **`worker.js`** in this repo to set up your own Cloudflare Worker: deploy it to Cloudflare, then configure the app to use the worker as the API base. Add this to your `.env` (or Vercel env vars) with the worker’s URL:

  ```bash
  NEXT_PUBLIC_FAKE_STORE_API_URL=https://your-worker.your-subdomain.workers.dev
  ```

  Replace with the actual URL of your deployed worker so product list and detail requests go through the proxy instead of fakestoreapi.com directly.

### Cart: confirm before removing

- When the user decreases an item’s quantity to **0**, the app asks for **confirmation** before removing that item from the cart (avoids accidental removal).
