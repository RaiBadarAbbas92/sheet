"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function PageHero({ title, kicker, image, text }: { title: string; kicker?: string; image: string; text?: string }) {
  return (
    <section className="relative h-[46vh] min-h-[320px] bg-stone text-paper">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-12 md:px-10">
        {kicker && <p className="label mb-4">{kicker}</p>}
        <h1 className="text-4xl font-light tracking-[-0.02em] md:text-6xl">{title}</h1>
        {text && <p className="mt-4 max-w-xl text-[15px] text-paper/85">{text}</p>}
      </div>
    </section>
  );
}

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="mb-8 text-xs text-muted">
      {items.map((c, i) => (
        <span key={c.label}>
          {i > 0 && " / "}
          {c.href ? (
            <Link href={c.href} className="hover:text-ink">
              {c.label}
            </Link>
          ) : (
            <span className="text-ink">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Accordion({ items, defaultOpen = null }: { items: { q: string; a: React.ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="border-t border-line">
      {items.map((it, i) => (
        <div key={it.q} className="border-b border-line">
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[14px]">
            {it.q}
            {open === i ? <Minus size={14} className="shrink-0" /> : <Plus size={14} className="shrink-0" />}
          </button>
          {open === i && <div className="pb-5 text-[14px] leading-relaxed text-muted">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px]">{label}</span>
      {children}
    </label>
  );
}

/** Two-column text + image block used across content pages. */
export function Split({ image, alt, children, flip }: { image: string; alt: string; children: React.ReactNode; flip?: boolean }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
      <div className={`relative aspect-[4/5] bg-stone ${flip ? "md:order-2" : ""}`}>
        <Image src={image} alt={alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="max-w-md">{children}</div>
    </div>
  );
}
