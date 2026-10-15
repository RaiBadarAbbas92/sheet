"use client";

import { useState } from "react";
import ProductCard from "./product-card";
import { useCatalog } from "./catalog";

export default function CategoryTabs() {
  const { products, categories } = useCatalog();
  const tabs = ["All", ...categories.map((c) => c.name)];
  const [tab, setTab] = useState("All");
  const list = products.filter((p) => tab === "All" || p.category === tab).slice(0, 8);

  return (
    <>
      {tabs.length > 2 && (
        <div className="no-scrollbar -mx-5 mb-10 flex gap-6 overflow-x-auto border-b border-line px-5 md:mx-0 md:px-0">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px shrink-0 border-b pb-3 text-[13px] ${tab === t ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}
