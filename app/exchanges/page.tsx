import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Split } from "@/components/ui";
import { photos } from "@/lib/products";

export const metadata: Metadata = { title: "Exchanges" };

export default function ExchangesPage() {
  return (
    <>
      <PageHero kicker="Help" title="Exchanges & returns" image={photos.exchanges} text="Changed your mind? Exchange unused items within 7 days of delivery." />
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:py-16 md:px-10 md:py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["7 days", "to request an exchange from the day your order arrives."],
            ["Unused", "items in original packaging, with tags attached."],
            ["Free", "exchange pickup in major cities. Elsewhere, courier costs apply."],
          ].map(([t, d]) => (
            <div key={t} className="border-t border-ink pt-5">
              <p className="text-3xl font-light">{t}</p>
              <p className="mt-2 text-[14px] text-muted">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <Split image={photos.texture} alt="Folded cotton bedding" flip>
            <h2 className="text-3xl font-light tracking-[-0.02em] md:text-4xl">How to exchange</h2>
            <ol className="mt-8 list-decimal space-y-4 pl-5 text-[14px] text-muted">
              <li>Message us on WhatsApp or use the contact form with your order number.</li>
              <li>Tell us the item and the size or colour you&rsquo;d like instead.</li>
              <li>We arrange a pickup and send the replacement once the item is checked.</li>
            </ol>
            <h3 className="mt-10 text-[15px] font-medium">Not eligible</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] text-muted">
              <li>Items that have been used or washed</li>
              <li>Sale items bought with an additional promo code</li>
              <li>Requests made more than 7 days after delivery</li>
            </ul>
            <Link href="/contact" className="btn mt-10">
              Start an exchange
            </Link>
          </Split>
        </div>
      </div>
    </>
  );
}
