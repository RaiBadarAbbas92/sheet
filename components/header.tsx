"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart";
import { useCatalog } from "./catalog";

export default function Header() {
  const { count, setOpen } = useCart();
  const { categories } = useCatalog();
  const categoryLinks = categories.map((c) => ({ href: `/shop?c=${encodeURIComponent(c.name)}`, label: c.name }));
  // The desktop bar has room for four categories; the menu lists them all.
  const nav = [{ href: "/shop", label: "Shop all" }, ...categoryLinks.slice(0, 4), { href: "/about", label: "About" }];
  const menuNav = [{ href: "/shop", label: "Shop all" }, ...categoryLinks, { href: "/about", label: "About" }, { href: "/track-order", label: "Track order" }, { href: "/contact", label: "Contact" }];
  const [menu, setMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [menuTop, setMenuTop] = useState(0);

  // The open menu covers the page on phones, so the page behind it should not scroll.
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    if (menu) setMenuTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <div className="bg-sand-deep px-4 py-2 text-center text-[10px] tracking-[0.12em] text-ink/80 uppercase sm:text-[11px]">
        Cash on delivery across Pakistan · Free delivery over Rs. 5,000
      </div>
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-sand-deep bg-sand">
      <div className="mx-auto grid h-14 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-16 sm:px-5 md:px-10">
        <nav className="hidden gap-6 text-[13px] lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:underline hover:underline-offset-4">
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="-ml-2 justify-self-start p-2 lg:hidden" aria-label={menu ? "Close menu" : "Menu"} aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
          {menu ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>

        <Link href="/" onClick={() => setMenu(false)} aria-label="Neend Mattress home" className="text-center font-medium whitespace-nowrap">
          {/* Stacked on phones so the name fits between the icons on 320px screens. */}
          <span className="block pl-[0.3em] text-base leading-none tracking-[0.3em] md:hidden">
            NEEND
            <span className="mt-1 block pl-[0.5em] text-[9px] tracking-[0.5em]">MATTRESS</span>
          </span>
          <span className="hidden pl-[0.35em] text-lg tracking-[0.35em] md:inline">NEEND MATTRESS</span>
        </Link>

        <div className="flex items-center justify-self-end gap-1 text-[13px] sm:gap-4">
          <Link href="/search" aria-label="Search" className="p-2" onClick={() => setMenu(false)}>
            <Search size={18} strokeWidth={1.5} />
          </Link>
          <button onClick={() => setOpen(true)} aria-label={`Cart, ${count} items`} className="relative -mr-2 flex items-center gap-1 p-2 sm:mr-0 sm:p-0">
            <ShoppingBag size={18} strokeWidth={1.5} className="sm:hidden" />
            {count > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-paper sm:hidden">{count}</span>
            )}
            <span className="hidden whitespace-nowrap sm:inline">Cart ({count})</span>
          </button>
        </div>
      </div>

      {menu && (
        <nav style={{ top: menuTop }} className="fixed inset-x-0 bottom-0 overflow-y-auto overscroll-contain border-t border-sand-deep bg-sand px-5 pb-10 lg:hidden">
          {menuNav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="block border-b border-sand-deep py-4 text-xl font-light">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
    </>
  );
}
