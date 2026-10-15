"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "./catalog";

const infoCols = [
  {
    title: "Help",
    links: [
      ["Track order", "/track-order"],
      ["Shipping", "/shipping"],
      ["Exchanges", "/exchanges"],
      ["Size guide", "/size-guide"],
      ["FAQs", "/faq"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Care guide", "/care-guide"],
      ["Wholesale", "/wholesale"],
      ["Contact", "/contact"],
    ],
  },
];

export default function Footer() {
  const [done, setDone] = useState(false);
  const { categories } = useCatalog();
  const cols = [
    {
      title: "Shop",
      links: [["All products", "/shop"], ...categories.map((c) => [c.name, `/shop?c=${encodeURIComponent(c.name)}`])],
    },
    ...infoCols,
  ];

  return (
    <footer className="border-t border-sand-deep bg-sand">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:grid-cols-3 sm:gap-12 sm:py-16 md:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 max-w-sm sm:col-span-3 lg:col-span-1">
          <p className="text-lg font-medium tracking-[0.35em]">NEEND MATTRESS</p>
          <p className="mt-2 text-[13px] text-muted">CEO — Ali Hasnain Sanghera</p>
          <p className="mt-6 text-[13px] font-medium">Newsletter</p>
          <p className="mt-1 text-[13px] text-muted">New collections and early sale access.</p>
          {done ? (
            <p className="mt-5 border-b border-ink py-3 text-[13px]">Thank you — you&rsquo;re on the list.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              className="mt-5 flex border-b border-ink"
            >
              <input required type="email" placeholder="Email address" className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted sm:text-[13px]" />
              <button aria-label="Subscribe" className="px-2">
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          )}
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-4 text-[13px] font-medium">{c.title}</p>
            <ul className="space-y-1 text-[13px] text-muted sm:space-y-2.5">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="inline-block py-1 hover:text-ink sm:py-0">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-sand-deep">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 px-5 py-5 text-xs text-muted sm:flex-row md:px-10">
          <p>© 2026 Neend Mattress, Lahore · CEO Ali Hasnain Sanghera</p>
          <p>Cash on delivery · Bank transfer</p>
        </div>
      </div>
    </footer>
  );
}
