/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";

const CART_STORAGE_KEY =
  process.env.NEXT_PUBLIC_CART_STORAGE_KEY ?? "my-cart-data";

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: 0,
  title: "",
  price: 0,
  description: "",
  category: "",
  image: "",
  ...overrides,
});

const getPersistedCart = (): { state: { items: unknown[] }; version: number } | null => {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as { state: { items: unknown[] }; version: number }) : null;
};

describe("cart store", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    useCartStore.setState({ items: [] });
  });

  describe("addToCart", () => {
    it("adds new item with quantity 1 by default", () => {
      const product = makeProduct({ id: 1, title: "Shirt", price: 10 });
      useCartStore.getState().addToCart(product);
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(1);
      expect(items[0].quantity).toBe(1);
    });

    it("adds new item with given quantity", () => {
      const product = makeProduct({ id: 1, title: "Shirt", price: 10 });
      useCartStore.getState().addToCart(product, 3);
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it("increments quantity when adding same product again", () => {
      const product = makeProduct({ id: 1, title: "Shirt", price: 10 });
      useCartStore.getState().addToCart(product);
      useCartStore.getState().addToCart(product, 2);
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it("adds second product as separate line", () => {
      const a = makeProduct({ id: 1, title: "A", price: 10 });
      const b = makeProduct({ id: 2, title: "B", price: 20 });
      useCartStore.getState().addToCart(a);
      useCartStore.getState().addToCart(b);
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(2);
      expect(items[0].id).toBe(1);
      expect(items[1].id).toBe(2);
    });
  });

  describe("updateQuantity", () => {
    it("increases quantity when delta is positive", () => {
      const product = makeProduct({ id: 1, price: 10 });
      useCartStore.getState().addToCart(product, 2);
      useCartStore.getState().updateQuantity(1, 3);
      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(5);
    });

    it("decreases quantity when delta is negative", () => {
      const product = makeProduct({ id: 1, price: 10 });
      useCartStore.getState().addToCart(product, 5);
      useCartStore.getState().updateQuantity(1, -2);
      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(3);
    });

    it("does not update when quantity would become zero or negative", () => {
      const product = makeProduct({ id: 1, price: 10 });
      useCartStore.getState().addToCart(product, 1);
      useCartStore.getState().updateQuantity(1, -1);
      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(1);
    });

    it("does not update when quantity would become negative with large delta", () => {
      const product = makeProduct({ id: 1, price: 10 });
      useCartStore.getState().addToCart(product, 2);
      useCartStore.getState().updateQuantity(1, -10);
      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(2);
    });

    it("does nothing when id is not in cart", () => {
      const product = makeProduct({ id: 1, price: 10 });
      useCartStore.getState().addToCart(product, 1);
      useCartStore.getState().updateQuantity(999, 1);
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(1);
    });
  });

  describe("removeItem", () => {
    it("removes item by id", () => {
      const product = makeProduct({ id: 1, price: 10 });
      useCartStore.getState().addToCart(product);
      useCartStore.getState().removeItem(1);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("leaves other items when removing one", () => {
      useCartStore.getState().addToCart(makeProduct({ id: 1, price: 10 }));
      useCartStore.getState().addToCart(makeProduct({ id: 2, price: 20 }));
      useCartStore.getState().removeItem(1);
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(2);
    });

    it("does nothing when id is not in cart", () => {
      useCartStore.getState().addToCart(makeProduct({ id: 1, price: 10 }));
      useCartStore.getState().removeItem(999);
      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  describe("cartTotal", () => {
    it("returns 0 for empty cart", () => {
      expect(useCartStore.getState().cartTotal()).toBe(0);
    });

    it("returns price * quantity for single item", () => {
      useCartStore.getState().addToCart(makeProduct({ id: 1, price: 10 }), 2);
      expect(useCartStore.getState().cartTotal()).toBe(20);
    });

    it("returns sum of price * quantity for multiple items", () => {
      useCartStore.getState().addToCart(makeProduct({ id: 1, price: 10 }), 2);
      useCartStore.getState().addToCart(makeProduct({ id: 2, price: 5 }), 4);
      expect(useCartStore.getState().cartTotal()).toBe(40);
    });
  });

  describe("persistent state", () => {
    it("persists items to localStorage after addToCart", () => {
      const product = makeProduct({ id: 1, title: "Shirt", price: 10 });
      useCartStore.getState().addToCart(product, 2);
      const persisted = getPersistedCart();
      expect(persisted).not.toBeNull();
      expect(persisted?.state?.items).toHaveLength(1);
      expect(persisted?.state?.items?.[0]).toMatchObject({
        id: 1,
        title: "Shirt",
        price: 10,
        quantity: 2,
      });
    });

    it("persists updated quantity after updateQuantity", () => {
      useCartStore.getState().addToCart(makeProduct({ id: 1, price: 10 }), 3);
      useCartStore.getState().updateQuantity(1, -1);
      const persisted = getPersistedCart();
      expect(persisted?.state?.items).toHaveLength(1);
      expect((persisted?.state?.items?.[0] as { quantity: number }).quantity).toBe(2);
    });

    it("persists empty items after removeItem", () => {
      useCartStore.getState().addToCart(makeProduct({ id: 1, price: 10 }));
      useCartStore.getState().removeItem(1);
      const persisted = getPersistedCart();
      expect(persisted?.state?.items).toHaveLength(0);
    });

    it("persists only items (partialized state) with expected structure", () => {
      useCartStore.getState().addToCart(makeProduct({ id: 1, title: "A", price: 5 }));
      const persisted = getPersistedCart();
      expect(persisted).toHaveProperty("state");
      expect(persisted).toHaveProperty("version");
      expect(persisted?.state).toHaveProperty("items");
      expect(Object.keys(persisted?.state ?? {})).toEqual(["items"]);
    });
  });
});
