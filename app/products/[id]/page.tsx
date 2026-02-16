import { ProductDetailModal } from "@/components/product-detail-modal";
import { fetchProductById } from "@/dummy/products";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const product = await fetchProductById(params.id);
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductModalPage(props: PageProps) {
  const params = await props.params;
  return <ProductDetailModal productId={params.id} />;
}
