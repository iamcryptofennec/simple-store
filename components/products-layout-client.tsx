"use client";

import { ProductList } from "@/components/product-list";

interface ProductsLayoutClientProps {
  children: React.ReactNode;
  productsSlot: React.ReactNode;
}

export const ProductsLayoutClient = (props: ProductsLayoutClientProps) => {
  return (
    <>
      <ProductList />
      {props.children}
      {props.productsSlot}
    </>
  );
};
