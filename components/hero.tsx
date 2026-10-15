"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { ArrowRight } from "lucide-react";
import { photos } from "@/lib/products";

// The hero is the only animated part of the site. LazyMotion + `m` keeps the motion bundle small.

const ease = [0.22, 1, 0.36, 1] as const;

const slides = [
  { src: photos.heroA, kicker: "Neend Mattress", title: ["Sleep better,", "every night"] },
  { src: photos.heroB, kicker: "New in", title: ["Fresh arrivals", "for your bedroom"] },
  { src: photos.heroC, kicker: "Across Pakistan", title: ["Cash on", "delivery"] },
];
const SLIDE_MS = 6000;

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i]);

  const s = slides[i];

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="relative h-[75svh] min-h-[480px] overflow-hidden bg-ink text-paper">
        <AnimatePresence initial={false}>
          <m.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <Image src={s.src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
          </m.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10" />

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-12 md:px-10 md:pb-16">
          <AnimatePresence mode="wait">
            <m.div key={i} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              <div className="overflow-hidden">
                <m.p className="label mb-5" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease }}>
                  {s.kicker}
                </m.p>
              </div>
              <h1 className="text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98] font-light tracking-[-0.03em]">
                {s.title.map((l, k) => (
                  <span key={l} className="block overflow-hidden">
                    <m.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.4 + k * 0.1, ease }}>
                      {l}
                    </m.span>
                  </span>
                ))}
              </h1>
            </m.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <Link href="/shop" className="btn bg-paper text-ink">
              Shop now <ArrowRight size={14} />
            </Link>
            <div className="flex gap-3">
              {slides.map((sl, k) => (
                <button key={sl.src} onClick={() => setI(k)} className="w-16 py-3 text-left md:w-24" aria-label={`Slide ${k + 1}`}>
                  <span className="mb-2 block text-[11px] opacity-70">0{k + 1}</span>
                  <span className="block h-px bg-paper/30">
                    {k === i && (
                      <m.span className="block h-px origin-left bg-paper" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: SLIDE_MS / 1000, ease: "linear" }} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
