import type { Product } from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_FAKE_STORE_API_URL || "https://fakestoreapi.com";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
