"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartContent } from "@/components/cart-content";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSheet = (props: CartSheetProps) => {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm flex flex-col p-6">
        <SheetHeader>
          <SheetTitle className="uppercase italic">My Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden flex flex-col mt-4">
          <CartContent showTitle={false} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
