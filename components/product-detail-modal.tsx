"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProductQuery } from "@/hooks/use-product-query";
import { useCartStore } from "@/store/cart";
import { ProductImage } from "@/components/product-image";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const CLOSE_DELAY_MS = 300;

interface ProductDetailModalProps {
  productId: string;
}

export const ProductDetailModal = (props: ProductDetailModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { data: product, isLoading, isError } = useProductQuery(props.productId);
  const addToCart = useCartStore((s) => s.addToCart);

  const handleClose = () => {
    if (window.history.length > 1 && window.history.state.back === "/") {
      router.back();
    } else {
      router.back();
      router.push("/");
    }
  };

  const requestClose = () => {
    setOpen(false);
    setTimeout(() => {
      handleClose();
    }, CLOSE_DELAY_MS);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      requestClose();
    }
  };

  return (
      <Dialog open={open} onOpenChange={(isOpen) => (isOpen ? undefined : requestClose())}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle>Product details</DialogTitle>
          </VisuallyHidden.Root>
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="aspect-square rounded-3xl" />
              <div className="space-y-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-9 w-20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ) : isError ? (
            <div className="py-6 text-center text-destructive">
              Failed to load product.
            </div>
          ) : product ? (
            <>
              <div className="space-y-6">
                <div className="aspect-square bg-muted rounded-3xl p-12 flex items-center justify-center">
                  <Suspense
                    fallback={
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    }
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.title}
                      scope="detail"
                      width={200}
                      height={200}
                      quality={75}
                      className="object-contain"
                    />
                  </Suspense>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {product.category}
                  </p>
                  <h2 className="text-2xl font-bold uppercase">{product.title}</h2>
                  <p className="text-3xl font-bold tracking-tighter">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    &quot;{product.description}&quot;
                  </p>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="w-full py-5 rounded-2xl font-bold"
                >
                  Add To Cart — ${product.price.toFixed(2)}
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
  );
};
