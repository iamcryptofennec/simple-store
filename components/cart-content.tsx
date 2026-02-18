"use client";

import { Suspense } from "react";
import { ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { ProductImage } from "@/components/product-image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CartContentProps {
  showTitle?: boolean;
}

export const CartContent = (props: CartContentProps) => {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const cartTotal = useCartStore((s) => s.cartTotal());
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleUpdateQuantity = (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (item === undefined) return;
    if (item.quantity + delta <= 0) {
      setConfirmDeleteId(id);
      return;
    }
    updateQuantity(id, delta);
  };

  const handleConfirmRemove = () => {
    if (confirmDeleteId !== null) {
      removeItem(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {props.showTitle ? (
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-lg tracking-tighter uppercase italic">
            My Cart
          </h3>
          <div className="bg-primary text-primary-foreground text-[10px] px-3 py-1.5 rounded-full font-bold">
            {items.length}
          </div>
        </div>
      ) : null}

      <div className="flex-1 space-y-6 overflow-y-auto pr-2 max-h-[60vh]">
        {items.length === 0 ? (
          <div className="py-20 text-center space-y-5 opacity-20">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Cart is empty
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="w-16 h-16 shrink-0 bg-muted p-2 rounded-2xl border border-border overflow-hidden">
                <Suspense
                  fallback={
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  }
                >
                  <ProductImage
                    src={item.image}
                    alt={item.title}
                    width={64}
                    height={64}
                    scope="cart"
                    className="w-full h-full object-contain"
                  />
                </Suspense>
              </div>
              <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-bold truncate leading-none mb-1.5">
                    {item.title}
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground tracking-tighter">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center border border-border rounded-xl w-fit bg-background shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] px-1 text-center font-bold min-w-[1.5rem]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 ? (
        <div className="mt-8 pt-8 border-t border-border space-y-5">
          <div className="flex justify-between items-end">
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
              Total
            </span>
            <span className="font-bold text-2xl tracking-tighter">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          <Button disabled={true} className="w-full py-5 rounded-2xl text-[12px] tracking-[0.25em] font-bold uppercase shadow-lg opacity-50 cursor-not-allowed">
            Process Checkout
          </Button>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">Checkout is not available yet</p>
        </div>
      ) : null}

      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => (open ? undefined : setConfirmDeleteId(null))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6 py-4">
            <p className="font-bold uppercase tracking-tighter">
              Remove this item from your cart?
            </p>
            <DialogFooter className="flex gap-4 sm:justify-center">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirmDeleteId(null)}
              >
                Keep
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmRemove}
              >
                Remove
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
