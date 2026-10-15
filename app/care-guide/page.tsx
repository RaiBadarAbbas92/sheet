import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui";
import { photos } from "@/lib/products";

export const metadata: Metadata = { title: "Care guide" };

const tips = [
  ["Wash", "Machine wash cold (30°C) on a gentle cycle. Wash darks and lights separately for the first few washes."],
  ["Detergent", "Use a mild liquid detergent. Skip bleach and fabric softener — they weaken cotton fibres over time."],
  ["Dry", "Tumble dry low or line dry in the shade. Direct sun can fade printed colours."],
  ["Iron", "Iron on medium while slightly damp for a crisp finish, or skip it for a relaxed look."],
  ["Store", "Keep in a cool, dry cupboard. Rotate between two sets to extend their life."],
];

export default function CareGuidePage() {
  return (
    <>
      <PageHero kicker="Care" title="Caring for your cotton" image={photos.laundry} text="A little care keeps your bedding soft and colourful for years." />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-12 sm:py-16 md:px-10 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <ol className="space-y-2">
          {tips.map(([t, d], i) => (
            <li key={t} className="flex gap-6 border-t border-line py-6">
              <span className="text-muted">0{i + 1}</span>
              <span>
                <span className="block text-lg">{t}</span>
                <span className="mt-1 block text-[14px] leading-relaxed text-muted">{d}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-2 gap-3 self-start">
          <div className="relative col-span-2 aspect-[4/3] bg-stone">
            <Image src={photos.washer} alt="Bedding in a washing machine" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-square bg-stone">
            <Image src={photos.weave} alt="Cotton weave close up" fill sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
          </div>
          <div className="relative aspect-square bg-stone">
            <Image src={photos.exchanges} alt="Folded towels and linens" fill sizes="(min-width:1024px) 22vw, 50vw" className="object-cover" />
          </div>
        </div>
      </div>
    </>
  );
}
