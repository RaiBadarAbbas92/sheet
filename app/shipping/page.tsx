import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Split } from "@/components/ui";
import { photos } from "@/lib/products";

export const metadata: Metadata = { title: "Shipping" };

const rates = [
  ["Lahore, Karachi, Islamabad, Rawalpindi", "2–3 working days", "Rs. 250"],
  ["Other major cities", "3–4 working days", "Rs. 250"],
  ["Rest of Pakistan", "4–6 working days", "Rs. 250"],
  ["Orders over Rs. 5,000", "As above", "Free"],
];

export default function ShippingPage() {
  return (
    <>
      <PageHero kicker="Help" title="Shipping & delivery" image={photos.shipping} text="We deliver to every city in Pakistan, with cash on delivery available everywhere." />
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:py-16 md:px-10 md:py-24">
        <ul className="divide-y divide-line border-y border-ink sm:hidden">
          {rates.map((r) => (
            <li key={r[0]} className="flex items-start justify-between gap-4 py-4 text-[14px]">
              <div>
                <p>{r[0]}</p>
                <p className="mt-1 text-[13px] text-muted">{r[1]}</p>
              </div>
              <p className="shrink-0 text-right text-muted">{r[2]}</p>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-ink">
                <th className="py-3 font-medium">Destination</th>
                <th className="py-3 font-medium">Delivery time</th>
                <th className="py-3 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r[0]} className="border-b border-line">
                  {r.map((c) => (
                    <td key={c} className="py-4 text-muted">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14 sm:mt-20">
          <Split image={photos.warehouse} alt="Packed orders ready to ship">
            <h2 className="text-3xl font-light tracking-[-0.02em] md:text-4xl">How it works</h2>
            <ol className="mt-8 space-y-6 text-[14px]">
              {[
                ["Order confirmed", "You'll get an order number and a confirmation call or message."],
                ["Packed", "Orders placed before 3pm are packed the same day."],
                ["Shipped", "We hand over to our courier partners (TCS, Leopards, M&P) with a tracking number."],
                ["Delivered", "Pay in cash at your door if you chose cash on delivery."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5 border-t border-line pt-5">
                  <span className="text-muted">0{i + 1}</span>
                  <span>
                    <span className="block">{t}</span>
                    <span className="text-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/track-order" className="btn btn-outline mt-10">
              Track an order
            </Link>
          </Split>
        </div>
      </div>
    </>
  );
}
