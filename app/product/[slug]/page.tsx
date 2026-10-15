import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/product-detail";
import ProductCard from "@/components/product-card";
import { getStoreProducts } from "@/lib/store-catalog";

const findProduct = async (slug: string) => (await getStoreProducts()).find((p) => p.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const pr = await findProduct((await params).slug);
  if (!pr) return { title: "Product" };
  const kind = pr.category.replace(/s$/, "");
  return { title: pr.name.includes(kind) || pr.name.includes(pr.category) ? pr.name : `${pr.name} ${kind}` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await findProduct((await params).slug);
  if (!product) notFound();

  const related = (await getStoreProducts()).filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />
      <section className="mx-auto max-w-[1440px] border-t border-line px-5 py-14 sm:py-20 md:px-10">
        <h2 className="mb-10 text-3xl font-light tracking-[-0.02em]">You may also like</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
      {/* Room for the pinned add-to-cart bar on phones. */}
      <div className="h-20 md:hidden" />
    </>
  );
}
