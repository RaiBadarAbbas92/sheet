"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./product-card";
import { useCatalog } from "./catalog";

export default function SearchView({ initialQuery }: { initialQuery: string }) {
  const { products, categories } = useCatalog();
  const [q, setQ] = useState(initialQuery);
  const term = q.trim().toLowerCase();
  const results = term ? products.filter((p) => [p.name, p.category, p.description, ...p.colours].some((f) => f.toLowerCase().includes(term))) : [];

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-14 md:px-10">
      <label className="flex items-center gap-4 border-b border-ink pb-4">
        <Search size={22} strokeWidth={1.5} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, colours…"
          className="w-full bg-transparent text-2xl font-light outline-none placeholder:text-muted md:text-4xl"
        />
      </label>

      {!term && categories.length > 0 && (
        <div className="mt-10">
          <p className="label mb-4 text-muted">Popular</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => c.name).map((t) => (
              <button key={t} onClick={() => setQ(t)} className="border border-line px-4 py-2 text-[13px] hover:border-ink">
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {term && (
        <>
          <p className="mb-8 mt-8 text-[13px] text-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-5 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-[14px]">
              No products found.{" "}
              <Link href="/shop" className="underline underline-offset-4">
                Browse all products
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
