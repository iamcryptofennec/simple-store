"use client";

import Image from "next/image";
import { getImageLoadPromise, isImageLoaded } from "@/utils/image-cache";

interface ProductImageProps
  extends Omit<
    React.ComponentProps<typeof Image>,
    "src" | "alt"
  > {
  src: string;
  alt: string;
  scope?: string;
}

export const ProductImage = (props: ProductImageProps) => {
  if (!isImageLoaded(props.src, props.scope)) {
    throw getImageLoadPromise(props.src, props.scope);
  }
  const rest = { ...props };
  delete (rest as Record<string, unknown>).src;
  delete (rest as Record<string, unknown>).alt;
  delete (rest as Record<string, unknown>).scope;
  return <Image {...rest} src={props.src} alt={props.alt} />;
};
