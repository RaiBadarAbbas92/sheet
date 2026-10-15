"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "./account-store";
import { Field } from "./ui";
import { formatPrice, photos } from "@/lib/products";

const steps = ["Confirmed", "Packed", "Shipped", "Delivered"] as const;

export default function TrackOrder({ initialId }: { initialId: string }) {
  const { orders } = useAccount();
  const [query, setQuery] = useState(initialId);
  const [searched, setSearched] = useState(initialId);

  const order = searched ? orders.find((o) => o.id.toLowerCase() === searched.trim().replace(/^#/, "").toLowerCase()) : undefined;
  const current = order ? steps.indexOf(order.status) : -1;

  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-2 lg:gap-20 lg:py-20">
      <div>
        <p className="label mb-4 text-muted">Help</p>
        <h1 className="text-4xl font-light tracking-[-0.02em] md:text-5xl">Track your order</h1>
        <p className="mt-4 text-[14px] text-muted">Enter the order number from your confirmation message.</p>

        <form
          className="mt-8 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(query);
          }}
        >
          <div className="flex-1">
            <Field label="Order number">
              <input value={query} onChange={(e) => setQuery(e.target.value)} required placeholder="e.g. BST-1A2B3C4D5E" className="field" />
            </Field>
          </div>
          <button className="btn">Track</button>
        </form>

        {searched && !order && (
          <p className="mt-8 border border-line p-6 text-[14px] text-muted">
            We couldn&rsquo;t find order &ldquo;{searched}&rdquo; on this device. Check the number, or{" "}
            <Link href="/contact" className="text-ink underline underline-offset-4">
              contact us
            </Link>
            .
          </p>
        )}

        {order && (
          <div className="mt-10 border border-line p-6">
            <div className="flex flex-wrap justify-between gap-2 text-[14px]">
              <p className="font-medium">#{order.id}</p>
              <p className="text-muted">{formatPrice(order.total)}</p>
            </div>
            <ol className="mt-8 grid grid-cols-4">
              {steps.map((s, i) => (
                <li key={s} className="text-[12px]">
                  <div className={`h-1 ${i <= current ? "bg-ink" : "bg-line"}`} />
                  <p className={`mt-3 ${i <= current ? "text-ink" : "text-muted"}`}>{s}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-[14px] text-muted">
              Delivering to {order.address.name}, {order.address.line}, {order.address.city}. Expected in 2–4 working days.
            </p>
          </div>
        )}
      </div>

      <div className="relative hidden aspect-[4/5] bg-stone lg:block">
        <Image src={photos.warehouse} alt="Orders ready to ship" fill sizes="50vw" className="object-cover" />
      </div>
    </div>
  );
}
