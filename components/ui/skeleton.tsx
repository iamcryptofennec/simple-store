import * as React from "react";

import { cn } from "@/utils/cn";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  const rest = { ...props };
  delete (rest as Record<string, unknown>).className;
  return (
    <div
      ref={ref}
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", props.className)}
      {...rest}
    />
  );
});
Skeleton.displayName = "Skeleton";

export { Skeleton };
