import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui";
import { photos } from "@/lib/products";

export const metadata: Metadata = { title: "Size guide" };

const table = {
  head: ["", "Single", "Double", "King", "Super King"],
  rows: [
    ["Mattress", '36 × 78"', '54 × 75"', '72 × 78"', '78 × 84"'],
    ["Flat sheet", '60 × 90"', '90 × 100"', '108 × 108"', '110 × 120"'],
    ["Fitted sheet", '36 × 78 × 12"', '54 × 75 × 12"', '72 × 78 × 14"', '78 × 84 × 14"'],
    ["Duvet cover", '55 × 85"', '80 × 90"', '90 × 100"', '100 × 110"'],
    ["Pillow covers", '1 × 20 × 30"', '2 × 20 × 30"', '2 × 20 × 30"', '2 × 20 × 30"'],
  ],
};

export default function SizeGuidePage() {
  return (
    <>
      <PageHero kicker="Help" title="Size guide" image={photos.sizeGuide} text="All measurements in inches. Measure your mattress, including its depth, before choosing." />
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:py-16 md:px-10 md:py-24">
        {/* Phones get one card per size; the full table needs more width than a phone has. */}
        <div className="divide-y divide-line border-y border-ink sm:hidden">
          {table.rows.map((r) => (
            <div key={r[0]} className="py-4">
              <p className="text-[15px]">{r[0]}</p>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
                {r.slice(1).map((c, i) => (
                  <div key={i}>
                    <dt className="text-xs text-muted">{table.head[i + 1]}</dt>
                    <dd>{c}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-ink">
                {table.head.map((h) => (
                  <th key={h} className="py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r) => (
                <tr key={r[0]} className="border-b border-line">
                  {r.map((c, i) => (
                    <td key={i} className={`py-4 ${i === 0 ? "" : "text-muted"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14 grid gap-10 sm:mt-20 md:grid-cols-2 md:gap-20">
          <div className="relative aspect-[4/3] bg-stone">
            <Image src={photos.detail} alt="Fitted sheet on a mattress" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-light tracking-[-0.02em]">How to measure</h2>
            <ol className="mt-8 space-y-5 text-[14px]">
              {[
                ["Width", "Measure across the top of the mattress, side to side."],
                ["Length", "Measure from the head of the mattress to the foot."],
                ["Depth", "Measure from the bottom seam to the top seam. Our fitted sheets suit mattresses up to 14\" deep."],
              ].map(([t, d]) => (
                <li key={t} className="border-t border-line pt-4">
                  <span className="block">{t}</span>
                  <span className="text-muted">{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
