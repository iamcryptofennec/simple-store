"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/types/product";

interface ProductListItemProps {
  product: Product;
  onAddOpenCart?: () => void;
}

export const ProductListItem = (props: ProductListItemProps) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const productId = props.product.id;
  const href = "/products/" + String(productId);

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(props.product);
    props.onAddOpenCart?.();
  };

  return (
    <Link
      href={href}
      prefetch={false}
      className="group relative flex cursor-pointer bg-card border border-border rounded-3xl overflow-hidden hover:border-primary transition-all duration-500"
    >
      <div className="w-28 sm:w-36 aspect-square shrink-0 bg-muted p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
        <Suspense
          fallback={
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          }
        >
          <ProductImage
            src={props.product.image}
            alt={props.product.title}
            width={144}
            height={144}
            quality={75}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          />
        </Suspense>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
        <div className="mb-1">
          <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            {props.product.category}
          </span>
        </div>
        <h3 className="pr-2 text-sm sm:text-base font-bold text-foreground md:truncate mb-1 group-hover:text-primary transition-colors tracking-tight">
          {props.product.title}
        </h3>
        <p className="text-base font-bold tracking-tight">
          ${props.product.price.toFixed(2)}
        </p>
      </div>
      {/* <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2">
        <Button
          size="sm"
          onClick={handleAddClick}
          className="flex items-center justify-center w-10 h-10 md:w-auto md:px-6 md:py-3.5 rounded-2xl shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline ml-2 text-[10px] font-bold uppercase tracking-[0.15em]">
            Add
          </span>
        </Button>
      </div> */}
    </Link>
  );
};
