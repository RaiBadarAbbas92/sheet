import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./product-card";
import CategoryTabs from "./category-tabs";
import { formatPrice, getMatches, photos, type Product } from "@/lib/products";
import { getStoreCategories, getStoreProducts } from "@/lib/store-catalog";

export function Ticker() {
  const items = ["Cash on delivery", "Free delivery over Rs. 5,000", "Delivery in 2–4 days", "7-day exchange", "Bank transfer accepted"];
  return (
    <div className="border-b border-line">
      <div className="no-scrollbar mx-auto flex max-w-[1440px] justify-between gap-8 overflow-x-auto px-5 py-3.5 md:px-10">
        {items.map((t) => (
          <span key={t} className="label shrink-0 text-muted">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHead({ kicker, title, href }: { kicker: string; title: string; href?: string }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6 md:mb-12">
      <div>
        <p className="label mb-3 text-muted">{kicker}</p>
        <h2 className="text-3xl font-light tracking-[-0.02em] md:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="label hidden border-b border-ink pb-1 md:block">
          View all
        </Link>
      )}
    </div>
  );
}

export async function Categories() {
  const categories = await getStoreCategories();
  if (!categories.length) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 sm:py-20 md:px-10">
      <SectionHead kicker="Categories" title="Shop by category" />
      {/* Swipeable row on phones, so an odd count never leaves one category stranded on its own line. */}
      <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-8 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5">
        {categories.map((c) => (
          <Link key={c.name} href={`/shop?c=${encodeURIComponent(c.name)}`} className="group block w-[42vw] shrink-0 snap-start md:w-auto">
            <div className="relative aspect-[3/4] bg-stone">
              <Image src={c.image} alt={c.name} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[13px]">
              <span className="group-hover:underline group-hover:underline-offset-4">{c.name}</span>
              <ArrowRight size={14} strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function NewIn() {
  const products = await getStoreProducts();
  // Products flagged "New" in the admin; otherwise the most recently added.
  const flagged = products.filter((p) => p.isNew);
  const list = (flagged.length ? flagged : products).slice(0, 4);
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-14 sm:pb-20 md:px-10">
      <SectionHead kicker="Just landed" title="New in" href={flagged.length ? "/shop?new=1" : "/shop"} />
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

export function Editorial() {
  return (
    <section className="bg-stone">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-14 sm:py-20 md:grid-cols-2 md:gap-20 md:px-10">
        <div className="relative aspect-[4/3] md:aspect-[4/5]">
          <Image src={photos.story} alt="Bedroom with cotton bedding" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="max-w-md">
          <p className="label mb-5 text-muted">Our cotton</p>
          <h2 className="text-4xl leading-[1.05] font-light tracking-[-0.02em] md:text-5xl">Woven in Faisalabad. Made to last.</h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            Long-staple cotton, a 300 thread count percale weave and reactive dyes that keep their colour. Every set is pre-washed, so it feels soft from the
            first night.
          </p>
          <dl className="mt-10 grid grid-cols-3 border-t border-ink/15 pt-6">
            {[
              ["300", "Thread count"],
              ["100%", "Cotton"],
              ["7 days", "Exchange"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="text-2xl font-light">{n}</dt>
                <dd className="mt-1 text-xs text-muted">{l}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about" className="btn btn-outline mt-10">
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}

export async function BestsellerStrip() {
  const products = await getStoreProducts();
  // Only products flagged "Bestseller" in the admin; New in already shows the latest ones.
  const list = products.filter((p) => p.isBestseller).slice(0, 8);
  if (!list.length) return null;
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead kicker="The edit" title="Bestsellers" href="/shop" />
      </div>
      <div className="no-scrollbar flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-4 md:gap-5 md:px-10">
        {list.map((p) => (
          <div key={p.slug} className="w-[70vw] shrink-0 snap-start sm:w-[40vw] lg:w-[22vw]">
            <ProductCard product={p} sizes="(min-width:1024px) 22vw, 70vw" />
          </div>
        ))}
      </div>
    </section>
  );
}

export async function RangeByCategory() {
  // With four or fewer products New in already shows them all.
  if ((await getStoreProducts()).length <= 4) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 sm:py-20 md:px-10">
      <SectionHead kicker="The collection" title="Shop the range" href="/shop" />
      <CategoryTabs />
    </section>
  );
}

export function Services() {
  const items = [
    ["Delivery", "2–4 working days, anywhere in Pakistan. Free over Rs. 5,000.", "/shipping"],
    ["Cash on delivery", "Pay when your order arrives, or by bank transfer for free delivery.", "/faq"],
    ["Exchange", "Changed your mind? Exchange unused items within 7 days.", "/exchanges"],
    ["Care", "Machine wash cold, tumble dry low. Gets softer with every wash.", "/care-guide"],
  ];
  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:grid-cols-2 sm:py-20 md:px-10 lg:grid-cols-4">
      {items.map(([t, d, href]) => (
        <Link key={t} href={href} className="border-t border-ink pt-5">
          <p className="text-[13px] font-medium">{t}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{d}</p>
        </Link>
      ))}
    </section>
  );
}

/** Products shown with the pieces the admin marked as made to match them. */
export async function MatchingSets() {
  const products = await getStoreProducts();
  const sets = products
    .flatMap((main) => {
      const partner = main.match ? undefined : getMatches(main, products)[0];
      return partner ? [{ main, pillow: partner }] : ([] as { main: Product; pillow: Product }[]);
    })
    .slice(0, 2);
  if (!sets.length) return null;

  return (
    <section className="bg-stone py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead kicker="Complete the set" title="Made to match" href="/shop" />
        <div className="grid gap-x-5 gap-y-14 md:grid-cols-2">
          {sets.map(({ main, pillow }) => (
            <div key={main.slug}>
              <div className="grid grid-cols-[3fr_2fr] gap-2">
                <Link href={`/product/${main.slug}`} className="relative aspect-[3/4] bg-paper">
                  <Image src={main.images[0]} alt={main.name} fill sizes="(min-width:768px) 30vw, 60vw" className="object-cover" />
                </Link>
                <Link href={`/product/${pillow.slug}`} className="relative bg-paper">
                  <Image src={pillow.images[0]} alt={pillow.name} fill sizes="(min-width:768px) 20vw, 40vw" className="object-cover" />
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
                <p>
                  {main.name} + {pillow.name}
                </p>
                <p className="text-muted">
                  {formatPrice(main.price)} + {formatPrice(pillow.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
