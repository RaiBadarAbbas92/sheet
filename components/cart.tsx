"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useCatalog } from "./catalog";
import { FREE_DELIVERY_OVER_PKR } from "@/lib/brand";

/** size and colour are empty when the product has none to choose from. */
export type Line = { slug: string; size: string; qty: number; colour?: string };

const sameLine = (l: Line, slug: string, size: string, colour = "") => l.slug === slug && l.size === size && (l.colour ?? "") === colour;

/** "King · Blue" — what was chosen for a line, for display. */
export const lineOptions = (l: Line) => [l.size, l.colour].filter(Boolean).join(" · ");

type CartCtx = {
  lines: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, size: string, qty?: number, openDrawer?: boolean, colour?: string) => void;
  update: (slug: string, size: string, qty: number, colour?: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};

const KEY = "neend-cart";
export const FREE_SHIPPING = FREE_DELIVERY_OVER_PKR;
export const SHIPPING_FEE = 250;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { getProduct } = useCatalog();
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Restore after mount so server and client render the same empty cart first.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from browser storage
      if (saved) setLines((JSON.parse(saved) as Line[]).filter((l) => getProduct(l.slug)));
    } catch {}
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once; the catalogue is fixed for the page load
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const value = useMemo<CartCtx>(() => {
    const update = (slug: string, size: string, qty: number, colour = "") =>
      setLines((ls) => (qty <= 0 ? ls.filter((l) => !sameLine(l, slug, size, colour)) : ls.map((l) => (sameLine(l, slug, size, colour) ? { ...l, qty } : l))));
    const add = (slug: string, size: string, qty = 1, openDrawer = true, colour = "") => {
      setLines((ls) => {
        const hit = ls.find((l) => sameLine(l, slug, size, colour));
        return hit ? ls.map((l) => (l === hit ? { ...l, qty: l.qty + qty } : l)) : [...ls, { slug, size, qty, ...(colour ? { colour } : {}) }];
      });
      if (openDrawer) setOpen(true);
    };
    return {
      lines,
      open,
      setOpen,
      add,
      update,
      clear: () => setLines([]),
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0),
    };
  }, [lines, open, getProduct]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {open && <CartDrawer />}
    </Ctx.Provider>
  );
}

export function CartLines({ compact }: { compact?: boolean }) {
  const { lines, update } = useCart();
  const { getProduct } = useCatalog();
  return (
    <ul>
      {lines.map((l) => {
        const pr = getProduct(l.slug);
        if (!pr) return null;
        return (
          <li key={l.slug + l.size + (l.colour ?? "")} className="flex gap-4 border-t border-line py-5">
            <Link href={`/product/${pr.slug}`} className={`relative shrink-0 bg-stone ${compact ? "h-28 w-22" : "h-36 w-28"}`}>
              <Image src={pr.images[0]} alt={pr.name} fill sizes="112px" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col text-sm">
              <div className="flex justify-between gap-2">
                <Link href={`/product/${pr.slug}`}>{pr.name}</Link>
                <p>{formatPrice(pr.price * l.qty)}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {[pr.category, lineOptions(l)].filter(Boolean).join(" / ")}
              </p>
              <p className="mt-1 text-xs text-muted">
                {formatPrice(pr.price)} {pr.compareAt > pr.price && <span className="line-through">{formatPrice(pr.compareAt)}</span>}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex w-fit items-center border border-line">
                  <button className="p-2.5" aria-label="Decrease" onClick={() => update(l.slug, l.size, l.qty - 1, l.colour)}>
                    <Minus size={12} />
                  </button>
                  <span className="w-7 text-center text-xs">{l.qty}</span>
                  <button className="p-2.5" aria-label="Increase" onClick={() => update(l.slug, l.size, l.qty + 1, l.colour)}>
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => update(l.slug, l.size, 0, l.colour)} className="py-2 text-xs text-muted underline underline-offset-4 hover:text-ink">
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CartDrawer() {
  const { lines, count, setOpen, subtotal } = useCart();
  const progress = Math.min(1, subtotal / FREE_SHIPPING);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-ink/40" onClick={() => setOpen(false)} />
      <aside className="fixed right-0 top-0 z-50 flex h-[100dvh] w-full max-w-[440px] flex-col bg-paper">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
          <p className="label">Cart ({count})</p>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="-mr-2 p-2">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-5 pb-5 text-xs text-muted sm:px-6">
          {subtotal >= FREE_SHIPPING ? "Free delivery unlocked" : `${formatPrice(FREE_SHIPPING - subtotal)} away from free delivery`}
          <div className="mt-2 h-px bg-line">
            <div className="h-px bg-ink" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <p className="text-sm text-muted">Your cart is empty.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="label border-b border-ink pb-1">
                Shop now
              </Link>
            </div>
          ) : (
            <CartLines compact />
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
            <div className="mb-5 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={() => setOpen(false)} className="btn btn-outline">
                View cart
              </Link>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn">
                Checkout
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-muted">Cash on delivery available</p>
          </div>
        )}
      </aside>
    </>
  );
}
