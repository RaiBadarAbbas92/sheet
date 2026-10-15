"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "./cart";
import { Accordion } from "./ui";
import { defaultSize, discount, formatPrice, isSoldOut, sizesFor, type Product } from "@/lib/products";
import { useCatalog } from "./catalog";

const delivery = {
  q: "Delivery & exchange",
  a: "Delivered in 2–4 working days across Pakistan. Free delivery over Rs. 5,000. Unused items can be exchanged within 7 days.",
};

export default function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const sizes = sizesFor(product);
  const [size, setSize] = useState<string>(defaultSize(product));
  const [colour, setColour] = useState(product.colour);
  const [qty, setQty] = useState(1);
  const soldOut = isSoldOut(product);
  const maxQty = Math.max(1, Math.min(20, product.stock));
  const addToCart = (openDrawer = true) => add(product.slug, size, qty, openDrawer, colour);
  // Only what the admin has filled in for this product.
  const details = [
    product.fabricDetails && { q: "Fabric & details", a: product.fabricDetails },
    product.careInstructions && { q: "Care", a: product.careInstructions },
    delivery,
  ].filter(Boolean) as { q: string; a: string }[];
  const matches = useCatalog().matchesFor(product);
  const [slide, setSlide] = useState(0);
  // On phones a bar with the add button stays pinned once the main one scrolls away.
  const buyRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="mx-auto grid max-w-[1440px] gap-10 pb-14 sm:pb-20 md:px-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
      {/* Swipe gallery on phones; a two-column grid from tablet up. */}
      <div className="relative lg:pt-10">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-2 md:gap-3 md:overflow-visible"
          onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        >
          {product.images.map((src, i) => (
            // An odd photo count leaves the last one spanning both columns.
            <div
              key={src}
              className={`relative aspect-[4/5] w-full shrink-0 snap-start bg-stone md:aspect-[3/4] ${i === product.images.length - 1 && product.images.length % 2 ? "md:col-span-2 md:aspect-[3/2]" : ""}`}
            >
              <Image src={src} alt={`${product.name} ${i + 1}`} fill priority={i === 0} sizes="(min-width:1024px) 30vw, (min-width:768px) 50vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
        {product.images.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 md:hidden" aria-hidden>
            {product.images.map((src, i) => (
              <span key={src} className={`h-1.5 rounded-full bg-paper transition-all ${i === slide ? "w-5" : "w-1.5 opacity-60"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 md:px-0 lg:sticky lg:top-24 lg:self-start lg:pt-10">
        <nav className="mb-5 text-xs text-muted md:mb-8">
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>{" "}
          /{" "}
          <Link href={`/shop?c=${encodeURIComponent(product.category)}`} className="hover:text-ink">
            {product.category}
          </Link>
        </nav>

        <h1 className="text-3xl font-light tracking-[-0.02em] sm:text-4xl md:text-5xl">{product.name}</h1>
        <p className="mt-2 text-[13px] text-muted">
          {[product.category, product.colours.length > 1 ? colour : product.colour].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-4 flex flex-wrap items-baseline gap-3 md:mt-6">
          <span className={`text-xl ${discount(product) > 0 ? "text-sale" : ""}`}>{formatPrice(product.price)}</span>
          {discount(product) > 0 && <span className="text-muted line-through">{formatPrice(product.compareAt)}</span>}
          {discount(product) > 0 && <span className="label bg-ink px-2 py-1 text-[10px] text-paper">−{discount(product)}%</span>}
        </p>
        {product.description && <p className="mt-6 max-w-md whitespace-pre-line text-[14px] leading-relaxed text-muted">{product.description}</p>}

        {product.colours.length > 1 && (
          <div className="mt-8 md:mt-10">
            <p className="mb-3 text-[13px]">Colour: {colour}</p>
            <div className="flex flex-wrap gap-2">
              {product.colours.map((c) => (
                <button
                  key={c}
                  onClick={() => setColour(c)}
                  className={`border px-4 py-2.5 text-[13px] ${colour === c ? "border-ink bg-ink text-paper" : "border-line text-muted hover:text-ink"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
        <div className="mt-8 md:mt-10">
          <div className="mb-3 flex justify-between text-[13px]">
            <span>Size: {size}</span>
            <Link href="/size-guide" className="text-muted underline underline-offset-4">
              Size guide
            </Link>
          </div>
          <div className={`grid ${sizes.length <= 2 ? "grid-cols-2" : sizes.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`relative -ml-px border px-1 py-3.5 text-[12px] first:ml-0 sm:text-[13px] ${size === s ? "z-10 border-ink bg-ink text-paper" : "border-line text-muted hover:text-ink"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        )}

        {soldOut ? (
          <div ref={buyRef} className="mt-6">
            <button disabled className="btn w-full">
              Sold out
            </button>
            <p className="mt-2 text-[13px] text-muted">This item is out of stock right now.</p>
          </div>
        ) : (
        <>
        <div ref={buyRef} className="mt-6 flex gap-2">
          <div className="flex shrink-0 items-center border border-line">
            <button className="px-4 py-4" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <Minus size={13} />
            </button>
            <span className="w-6 text-center text-[13px]">{qty}</span>
            <button className="px-4 py-4" aria-label="Increase" onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>
              <Plus size={13} />
            </button>
          </div>
          <button onClick={() => addToCart()} className="btn flex-1 px-3">
            <span className="sm:hidden">Add — {formatPrice(product.price * qty)}</span>
            <span className="hidden sm:inline">Add to cart — {formatPrice(product.price * qty)}</span>
          </button>
        </div>
        <Link href="/checkout" onClick={() => addToCart(false)} className="btn btn-outline mt-2 w-full">
          Buy it now
        </Link>
        </>
        )}

        {matches.length > 0 && (
          <div className="mt-8 border-t border-line pt-6">
            <p className="mb-4 text-[13px]">{product.match ? "Made to match" : "Complete the set"}</p>
            {matches.map((m) => (
              <div key={m.slug} className="flex items-center gap-4">
                <Link href={`/product/${m.slug}`} className="relative h-24 w-20 shrink-0 bg-stone">
                  <Image src={m.images[0]} alt={m.name} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="flex-1 text-[13px]">
                  <Link href={`/product/${m.slug}`}>{m.name}</Link>
                  <p className="mt-1">
                    <span className="text-sale">{formatPrice(m.price)}</span> {m.compareAt > m.price && <span className="text-muted line-through">{formatPrice(m.compareAt)}</span>}
                  </p>
                </div>
                {isSoldOut(m) ? (
                  <span className="text-xs text-muted">Sold out</span>
                ) : (
                  <button onClick={() => add(m.slug, defaultSize(m), 1, true, m.colour)} className="btn btn-outline px-4 py-3">
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <ul className="mt-6 space-y-1 text-xs text-muted">
          <li>Delivery in 2–4 working days</li>
          <li>Cash on delivery available</li>
        </ul>

        <div className="mt-10">
          <Accordion items={details} />
        </div>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 ${soldOut ? "hidden" : ""} flex items-center gap-3 border-t border-line bg-paper px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform md:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!showBar}
      >
        <div className="min-w-0 flex-1 text-[13px]">
          <p className="truncate">{product.name}</p>
          <p className="text-muted">
            {[size, product.colours.length > 1 ? colour : ""].filter(Boolean).join(" · ")}
            {(size || product.colours.length > 1) && " · "}
            <span className="text-sale">{formatPrice(product.price * qty)}</span>
          </p>
        </div>
        <button onClick={() => addToCart()} tabIndex={showBar ? 0 : -1} className="btn px-5 py-3.5">
          Add to cart
        </button>
      </div>
    </div>
  );
}
