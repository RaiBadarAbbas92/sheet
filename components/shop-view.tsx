"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ProductCard from "./product-card";
import { useCatalog } from "./catalog";

const sorts = { featured: "Featured", az: "Name A–Z", za: "Name Z–A" } as const;

export default function ShopView({ initialCategory, initialNew }: { initialCategory: string; initialNew: boolean }) {
  const { products, categories } = useCatalog();
  const cats = ["All", ...categories.map((c) => c.name)];
  const [cat, setCat] = useState(initialCategory);
  const [onlyNew, setOnlyNew] = useState(initialNew);
  const [sort, setSort] = useState<keyof typeof sorts>("featured");

  const list = useMemo(() => {
    const l = products.filter((p) => (cat === "All" || p.category === cat) && (!onlyNew || p.isNew));
    if (sort === "az") l.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") l.sort((a, b) => b.name.localeCompare(a.name));
    return l;
  }, [products, cat, onlyNew, sort]);
  const info = categories.find((c) => c.name === cat);
  // The chosen category's product photos, or one photo from each of the first categories.
  const banner = (info?.banner.length ? info.banner : categories.map((c) => c.image)).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:pb-28 pt-12 md:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-light tracking-[-0.03em] md:text-6xl">{cat === "All" ? "All products" : cat}</h1>
          <p className="mt-3 max-w-lg text-[14px] text-muted">{info?.blurb || "Everything in the store, delivered across Pakistan with cash on delivery."}</p>
        </div>
        <p className="text-[13px] text-muted">{list.length} products</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-2 md:mb-12 md:grid-cols-3 md:gap-3">
        {banner.map((src, i) => (
          <div key={src + i} className={`relative bg-stone md:col-span-1 md:aspect-[4/3] ${i === 0 ? "col-span-2 aspect-[2/1]" : "hidden md:block"}`}>
            <Image src={src} alt="" fill priority={i === 0} sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mb-10 flex flex-col gap-3 border-y border-line md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto px-5 md:mx-0 md:px-0">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`-mb-px shrink-0 border-b py-4 text-[13px] ${cat === c ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-6 pb-3 text-[13px] md:justify-start md:pb-0">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} className="accent-[var(--ink)]" />
            New only
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)} className="border border-line bg-paper px-3 py-2 text-base outline-none sm:text-[13px]">
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-5 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="py-24 text-center text-[13px] text-muted">{products.length ? "No products match these filters." : "New products are on their way — check back soon."}</p>
      )}
    </div>
  );
}
