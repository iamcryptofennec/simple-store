import { describe, it, expect } from "vitest";
import {
  filterProductsBySearch,
  groupProductsByCategory,
} from "@/utils/products";
import type { Product } from "@/types/product";

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: 1,
  title: "",
  price: 0,
  description: "",
  category: "",
  image: "",
  ...overrides,
});

describe("filterProductsBySearch", () => {
  const products: Product[] = [
    makeProduct({
      id: 1,
      title: "Blue Shirt",
      category: "Clothing",
      price: 19.99,
    }),
    makeProduct({
      id: 2,
      title: "Summer Hat",
      category: "Accessories",
      price: 14.99,
    }),
    makeProduct({
      id: 3,
      title: "Sneakers",
      category: "Clothing",
      price: 59.99,
    }),
  ];

  it("returns all products when search is empty", () => {
    expect(filterProductsBySearch(products, "")).toHaveLength(3);
  });

  it("returns all products when search is only whitespace", () => {
    expect(filterProductsBySearch(products, "   ")).toHaveLength(3);
  });

  it("filters by title (case-insensitive)", () => {
    const result = filterProductsBySearch(products, "shirt");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Blue Shirt");
  });

  it("matches title case-insensitively", () => {
    const result = filterProductsBySearch(products, "SHIRT");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Blue Shirt");
  });

  it("filters by category (case-insensitive)", () => {
    const result = filterProductsBySearch(products, "accessories");
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("Accessories");
  });

  it("returns products matching either title or category", () => {
    const result = filterProductsBySearch(products, "clothing");
    expect(result).toHaveLength(2);
  });

  it("returns empty array when no match", () => {
    expect(filterProductsBySearch(products, "xyz")).toHaveLength(0);
  });

  it("returns empty array for empty products", () => {
    expect(filterProductsBySearch([], "shirt")).toHaveLength(0);
  });
});

describe("groupProductsByCategory", () => {
  it("returns empty object for empty array", () => {
    expect(groupProductsByCategory([])).toEqual({});
  });

  it("groups products by single category", () => {
    const products: Product[] = [
      makeProduct({ id: 1, category: "X", title: "A" }),
      makeProduct({ id: 2, category: "X", title: "B" }),
    ];
    const grouped = groupProductsByCategory(products);
    expect(Object.keys(grouped)).toHaveLength(1);
    expect(grouped.X).toHaveLength(2);
    expect(grouped.X?.map((p) => p.id)).toEqual([1, 2]);
  });

  it("groups products by multiple categories", () => {
    const products: Product[] = [
      makeProduct({ id: 1, category: "X", title: "A" }),
      makeProduct({ id: 2, category: "X", title: "B" }),
      makeProduct({ id: 3, category: "Y", title: "C" }),
    ];
    const grouped = groupProductsByCategory(products);
    expect(grouped.X).toHaveLength(2);
    expect(grouped.Y).toHaveLength(1);
    expect(grouped.Y?.[0].id).toBe(3);
  });

  it("preserves product fields in each group", () => {
    const products: Product[] = [
      makeProduct({ id: 1, category: "A", title: "Item", price: 10 }),
    ];
    const grouped = groupProductsByCategory(products);
    expect(grouped.A?.[0]).toMatchObject({
      id: 1,
      category: "A",
      title: "Item",
      price: 10,
    });
  });
});
