import Link from "next/link";
import Hero from "@/components/hero";
import { BestsellerStrip, Categories, Editorial, MatchingSets, NewIn, RangeByCategory, Services, Ticker } from "@/components/home";
import { getStoreProducts } from "@/lib/store-catalog";

export default async function Home() {
  // Product sections hide themselves when the admin has no active products yet.
  const empty = !(await getStoreProducts()).length;
  return (
    <>
      <Hero />
      <Ticker />
      {empty && (
        <section className="mx-auto max-w-xl px-5 py-20 text-center sm:py-28">
          <p className="label mb-4 text-muted">Coming soon</p>
          <h2 className="text-3xl font-light tracking-[-0.02em] sm:text-4xl">New products are on their way.</h2>
          <p className="mt-4 text-[14px] text-muted">Check back shortly, or get in touch and we&rsquo;ll let you know when they&rsquo;re in.</p>
          <Link href="/contact" className="btn btn-outline mt-8">
            Contact us
          </Link>
        </section>
      )}
      <Categories />
      <NewIn />
      <Editorial />
      <BestsellerStrip />
      <MatchingSets />
      <RangeByCategory />
      <Services />
    </>
  );
}
