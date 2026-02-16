import { ProductDetailModal } from "@/components/product-detail-modal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InterceptedProductPage(props: PageProps) {
  const params = await props.params;
  return <ProductDetailModal productId={params.id} />;
}
