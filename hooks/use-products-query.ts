import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/dummy/products";

export function useProductsQuery() {
  // Cache the products list for 1 hour
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 60,
  });
}
