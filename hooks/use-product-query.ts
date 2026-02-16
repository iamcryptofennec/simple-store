import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/dummy/products";

export function useProductQuery(id: string | null) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id as string),
    enabled: id !== null && id !== "",
  });
}
