import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, Split } from "@/components/ui";
import { lookbook, photos } from "@/lib/products";

export const metadata: Metadata = { title: "About us" };

const steps = [
  { t: "Grown", d: "Long-staple cotton from farms in Sindh and southern Punjab.", img: photos.cotton },
  { t: "Woven", d: "A 300 thread count percale weave, made in Faisalabad.", img: photos.swatches },
  { t: "Finished", d: "Reactive-dyed, pre-washed and folded by hand in Lahore.", img: photos.folded },
];

export default function AboutPage() {
  return (
    <>
      <PageHero kicker="About Neend Mattress" title="Better sleep shouldn't cost more." image={photos.about} />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20 text-center md:py-28">
        <p className="text-xl leading-relaxed font-light sm:text-2xl md:text-3xl">
          Neend Mattress started in 2019 with one question: why does good cotton bedding cost so much in Pakistan? We work directly with mills, cut out the middlemen
          and sell every set at one fair price.
        </p>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-14 sm:pb-20 md:px-10 md:pb-28">
        <p className="label mb-10 text-muted">From field to bed</p>
        <div className="grid gap-10 md:grid-cols-3 md:gap-5">
          {steps.map((s, i) => (
            <div key={s.t}>
              <div className="relative aspect-[4/5] bg-stone">
                <Image src={s.img} alt={s.t} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 text-xs text-muted">0{i + 1}</p>
              <p className="mt-1 text-lg">{s.t}</p>
              <p className="mt-1 text-[14px] text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Split image={photos.suite} alt="Bedroom styled with Neend Mattress bedding">
            <p className="label mb-6 text-muted">What we believe</p>
            <h2 className="text-4xl font-light tracking-[-0.02em] md:text-5xl">Fewer, better things.</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-muted">
              We make a small range of bedding and make it well. No synthetic blends, no seasonal gimmicks — just sheets, covers and comforters that hold up to
              years of washing.
            </p>
            <ul className="mt-8 space-y-3 border-t border-ink/15 pt-6 text-[14px]">
              <li>100% cotton, always</li>
              <li>One price across the range</li>
              <li>Made in Pakistan, by people paid fairly</li>
            </ul>
          </Split>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pt-20 md:px-10 md:pt-28">
        <p className="label mb-4 text-muted">Our fabrics</p>
        <h2 className="mb-10 text-4xl font-light tracking-[-0.02em] md:text-5xl">Percale, sateen & quilted cotton</h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {[
            [photos.weave, "Percale weave"],
            [photos.satin, "Sateen finish"],
            [photos.quilted, "Quilted duvet"],
            [photos.pillowStack, "Pillow covers"],
          ].map(([src, label]) => (
            <figure key={label}>
              <div className="relative aspect-square bg-stone">
                <Image src={src} alt={label} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-[13px] text-muted">{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:py-20 md:px-10 md:py-28">
        <Split image={photos.hotelA} alt="Hotel room made up with Neend Mattress bedding" flip>
          <p className="label mb-6 text-muted">Trusted by hotels</p>
          <h2 className="text-4xl font-light tracking-[-0.02em] md:text-5xl">From homes to hotel rooms.</h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            Guest houses and boutique hotels across Pakistan make up their rooms with Neend Mattress. The same sheets, the same price — just ordered by the
            hundred.
          </p>
          <Link href="/wholesale" className="btn btn-outline mt-8">
            Wholesale enquiries
          </Link>
        </Split>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-14 sm:pb-20 md:px-10">
        <p className="label mb-4 text-muted">Neend Mattress at home</p>
        <h2 className="mb-10 text-4xl font-light tracking-[-0.02em] md:text-5xl">Shared by our customers</h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {lookbook.map((src) => (
            <div key={src} className="relative aspect-[4/5] bg-stone">
              <Image src={src} alt="Customer bedroom" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-10 border-t border-line px-5 py-14 sm:py-20 md:grid-cols-4 md:px-10">
        {[
          ["40,000+", "Homes across Pakistan"],
          ["120+", "Cities delivered to"],
          ["4.8 / 5", "Average rating"],
          ["2019", "Founded in Lahore"],
        ].map(([n, l]) => (
          <div key={l}>
            <p className="text-4xl font-light">{n}</p>
            <p className="mt-1 text-[13px] text-muted">{l}</p>
          </div>
        ))}
      </section>

      <section className="relative h-[60vh] min-h-[380px]">
        <Image src={photos.pillows} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative flex h-full flex-col items-center justify-center px-5 text-center text-paper">
          <h2 className="text-4xl font-light md:text-6xl">See the collection</h2>
          <Link href="/shop" className="btn mt-8 bg-paper text-ink">
            Shop now
          </Link>
        </div>
      </section>
    </>
  );
}
