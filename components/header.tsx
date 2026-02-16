"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ShoppingCart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CartSheet } from "@/components/cart-sheet";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Header = (props: HeaderProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 h-20 flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg shadow-sm">
                <ShoppingBag className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg md:text-2xl tracking-tighter uppercase italic">
                LING STORE
              </span>
            </Link>
          </div>
          <div className="flex-1 max-w-2xl relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <Input
              type="text"
              placeholder="Search..."
              value={props.searchQuery}
              onChange={(e) => props.onSearchChange(e.target.value)}
              className="w-full bg-muted border rounded-2xl py-2.5 md:py-3.5 pl-11 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            {/* <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Catalog
              </Link>
            </div> */}
            {/* <div className="hidden md:block h-8 w-px bg-border" /> */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 block md:hidden hover:bg-accent rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </nav>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};
