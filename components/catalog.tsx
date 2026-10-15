"use client";

import { createContext, useContext, useMemo } from "react";
import { getMatches, type Product, type StoreCategory } from "@/lib/products";

type CatalogCtx = {
  products: Product[];
  categories: StoreCategory[];
  getProduct: (slug: string) => Product | undefined;
  matchesFor: (pr: Product) => Product[];
};

const Ctx = createContext<CatalogCtx | null>(null);

export const useCatalog = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCatalog must be used inside CatalogProvider");
  return c;
};

/** Holds the live catalogue loaded by the root layout so client components can read it. */
export function CatalogProvider({ products, categories, children }: { products: Product[]; categories: StoreCategory[]; children: React.ReactNode }) {
  const value = useMemo<CatalogCtx>(() => {
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return {
      products,
      categories,
      getProduct: (slug) => bySlug.get(slug),
      matchesFor: (pr) => getMatches(pr, products),
    };
  }, [products, categories]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
