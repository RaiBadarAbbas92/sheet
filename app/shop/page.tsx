import type { Metadata } from "next";
import ShopView from "@/components/shop-view";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ c?: string; new?: string }> }) {
  const { c, new: isNew } = await searchParams;
  // Keyed so header links (which only change the query) reset the filters.
  return <ShopView key={`${c}-${isNew}`} initialCategory={c ?? "All"} initialNew={isNew === "1"} />;
}
