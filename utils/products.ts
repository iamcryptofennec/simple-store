import type { Product } from "@/types/product";

export function filterProductsBySearch(
  products: Product[],
  searchQuery: string
): Product[] {
  if (!searchQuery.trim()) return products;
  const q = searchQuery.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
}

export function groupProductsByCategory(
  products: Product[]
): Record<string, Product[]> {
  return products.reduce<Record<string, Product[]>>((acc, product) => {
    const cat = product.category;
    if (acc[cat] === undefined) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});
}
