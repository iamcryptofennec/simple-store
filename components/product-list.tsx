"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { ProductListItem } from "@/components/product-list-item";
import { CartContent } from "@/components/cart-content";
import { useProductsQuery } from "@/hooks/use-products-query";
import {
  filterProductsBySearch,
  groupProductsByCategory,
} from "@/utils/products";

export const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const isScrollingRef = useRef(false);
  const { data: products = [], isLoading, isError } = useProductsQuery();

  const filtered = filterProductsBySearch(products, searchQuery);
  const groupedProducts = groupProductsByCategory(filtered);
  const categories = Object.keys(groupedProducts);

  useEffect(() => {
    if (categories.length > 0 && activeCategory === "") {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const scrollToCategory = (catId: string) => {
    const element = document.getElementById(catId);
    if (element) {
      isScrollingRef.current = true;
      setActiveCategory(catId);
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    if (isLoading || categories.length === 0) return;
    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -60% 0px",
      threshold: [0, 0.01, 0.5],
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return;
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const sorted = visibleEntries.sort((a, b) => {
          const aDist = Math.abs(a.boundingClientRect.top - 80);
          const bDist = Math.abs(b.boundingClientRect.top - 80);
          return aDist - bDist;
        });
        const topMostId = sorted[0].target.id;
        if (topMostId !== activeCategory) {
          setActiveCategory(topMostId);
        }
      }
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    categories.forEach((cat) => {
      const element = document.getElementById(cat);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [isLoading, categories, searchQuery, activeCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Syncing LING.STORE
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-sm font-medium text-destructive">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="max-w-[1600px] mx-auto px-4 py-8 flex gap-6 lg:gap-10">
        <aside className="hidden lg:block w-44 shrink-0">
          <div className="sticky top-28 space-y-1.5">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 px-2">
              Navigation
            </h4>
            <p className="text-[10px] text-muted-foreground mb-4 px-2">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => scrollToCategory(cat)}
                className={
                  activeCategory === cat
                    ? "block w-full text-left px-4 py-3 text-xs rounded-xl transition-all duration-300 bg-primary text-primary-foreground font-bold shadow-xl scale-[1.03] z-10"
                    : "block w-full text-left px-4 py-3 text-xs rounded-xl transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-accent"
                }
              >
                {cat.toUpperCase()} ({groupedProducts[cat].length})
              </button>
            ))}
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          {categories.length > 0 ? (
            categories.map((category) => (
              <section
                key={category}
                id={category}
                className="mb-16 scroll-mt-24"
              >
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl font-bold tracking-tighter uppercase">
                    {category}
                  </h2>
                  <div className="h-px bg-border flex-1" />
                </div>
                <div className="space-y-4">
                  {groupedProducts[category].map((product) => (
                    <ProductListItem key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="py-40 text-center">
              <p className="text-muted-foreground italic">
                No products found matching your search.
              </p>
            </div>
          )}
        </main>
        <aside className="hidden md:block w-80 shrink-0">
          <div className="sticky top-28 h-[calc(100vh-140px)] bg-card rounded-[2rem] p-7 border border-border shadow-sm">
            <CartContent showTitle={true} />
          </div>
        </aside>
      </div>
    </div>
  );
};
