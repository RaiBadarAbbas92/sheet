"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FREE_SHIPPING, SHIPPING_FEE, lineOptions, useCart } from "./cart";
import { useAccount, type Order } from "./account-store";
import { useCatalog } from "./catalog";
import { Field } from "./ui";
import { formatPrice, photos } from "@/lib/products";

const fallbackCities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad"];

type PaymentMethod = "cod" | "full_advance";

type PaymentSettings = {
  codEnabled?: boolean;
  manualTransferEnabled?: boolean;
  codDeliveryChargePkr?: number;
  codMinOrderPkr?: number;
  codMaxOrderPkr?: number;
};

type PaymentDetails = {
  bankName?: string;
  bankTitle?: string;
  bankAccountNumber?: string;
  bankIban?: string;
  instructions?: string;
  whatsappNumber?: string;
};

type Placed = Order & { advance: number; onDelivery: number; method: PaymentMethod; details: PaymentDetails };

const methodLabel: Record<PaymentMethod, string> = { cod: "Cash on delivery", full_advance: "Bank transfer (pay in advance)" };

export default function CheckoutForm() {
  const { lines, subtotal, clear } = useCart();
  const { placeOrder } = useAccount();
  const { getProduct } = useCatalog();
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [cities, setCities] = useState<string[]>(fallbackCities);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Phones show the order summary as a collapsible bar above the form.
  const [summaryOpen, setSummaryOpen] = useState(false);
  // One id per checkout visit, so a double-submit is recognised by the API as the same order.
  const attemptId = useRef("");

  useEffect(() => {
    fetch("/api/store-settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.paymentSettings ?? {}))
      .catch(() => setSettings({}));
    // PostEx's city list when a courier token is configured; otherwise the built-in list stays.
    fetch("/api/postex/cities")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const names = (d?.cities ?? []).map((c: string | { name?: string; operationalCityName?: string }) => (typeof c === "string" ? c : c.operationalCityName || c.name || "")).filter(Boolean);
        if (names.length) setCities(names);
      })
      .catch(() => {});
  }, []);

  const codEnabled = settings?.codEnabled !== false;
  const advanceEnabled = settings?.manualTransferEnabled !== false;
  const method: PaymentMethod = payment === "cod" && !codEnabled ? "full_advance" : payment === "full_advance" && !advanceEnabled ? "cod" : payment;

  // Mirrors lib/paymentRules.js; the API recalculates and its figures are what the order records.
  const fee = Number(settings?.codDeliveryChargePkr ?? SHIPPING_FEE);
  const shipping = method === "full_advance" || subtotal >= FREE_SHIPPING ? 0 : fee;
  const total = subtotal + shipping;

  if (placed) {
    const d = placed.details;
    return (
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-2 lg:gap-20 lg:py-20">
        <div className="self-center">
          <p className="label mb-4 text-muted">Order #{placed.id}</p>
          <h1 className="text-4xl font-light tracking-[-0.02em] md:text-5xl">Thank you, {placed.address.name.split(" ")[0]}.</h1>
          <p className="mt-6 max-w-md text-[15px] text-muted">
            Your order is confirmed. We&rsquo;ll call {placed.address.phone} to confirm delivery, usually within a few hours.
          </p>
          <dl className="mt-10 space-y-3 border-t border-line pt-6 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted">Total</dt>
              <dd>{formatPrice(placed.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd>{placed.payment}</dd>
            </div>
            {placed.advance > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Pay now by bank transfer</dt>
                <dd>{formatPrice(placed.advance)}</dd>
              </div>
            )}
            {placed.onDelivery > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Pay on delivery</dt>
                <dd>{formatPrice(placed.onDelivery)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Deliver to</dt>
              <dd className="text-right">
                {placed.address.line}, {placed.address.city}
              </dd>
            </div>
          </dl>
          {placed.method === "full_advance" && (d.bankAccountNumber || d.bankIban || d.instructions) && (
            <div className="mt-8 bg-sand p-6 text-[14px]">
              <p className="font-medium">Bank details</p>
              <dl className="mt-3 space-y-1 text-muted">
                {d.bankName && <div>Bank: {d.bankName}</div>}
                {d.bankTitle && <div>Account title: {d.bankTitle}</div>}
                {d.bankAccountNumber && <div>Account number: {d.bankAccountNumber}</div>}
                {d.bankIban && <div>IBAN: {d.bankIban}</div>}
              </dl>
              {d.instructions && <p className="mt-3 text-muted">{d.instructions}</p>}
            </div>
          )}
          <div className="mt-10 flex flex-wrap gap-2">
            <Link href={`/track-order?id=${placed.id}`} className="btn">
              Track order
            </Link>
            <Link href="/shop" className="btn btn-outline">
              Continue shopping
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] bg-stone">
          <Image src={photos.thanks} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 sm:py-28 text-center">
        <h1 className="text-4xl font-light">Nothing to check out</h1>
        <p className="mt-4 text-[14px] text-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn mt-8">
          Shop now
        </Link>
      </div>
    );
  }

  const payments = [
    codEnabled && { id: "cod" as const, label: methodLabel.cod, note: shipping ? `Pay in cash when your order arrives. Delivery ${formatPrice(fee)}.` : "Pay in cash when your order arrives." },
    advanceEnabled && { id: "full_advance" as const, label: methodLabel.full_advance, note: "Free delivery. Account details are shown once you place the order." },
  ].filter(Boolean) as { id: PaymentMethod; label: string; note: string }[];

  return (
    <form
      className="mx-auto grid max-w-[1440px] gap-8 px-5 pt-0 pb-14 md:px-10 md:pt-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20"
      onSubmit={async (e) => {
        e.preventDefault();
        if (submitting) return;
        const f = new FormData(e.currentTarget);
        const customer = {
          fullName: String(f.get("name") || "").trim(),
          phone: String(f.get("phone") || "").replace(/[^\d+]/g, ""),
          email: String(f.get("email") || "").trim(),
          address: String(f.get("address") || "").trim(),
          city: String(f.get("city") || ""),
          postalCode: String(f.get("postal") || "").trim(),
          notes: String(f.get("notes") || "").trim(),
        };
        const items = lines.flatMap((l) => {
          const pr = getProduct(l.slug);
          return pr ? [{ id: pr.id, articleNumber: pr.articleNumber, name: pr.name, quantity: l.qty, size: l.size, color: l.colour || pr.colour }] : [];
        });

        attemptId.current ||= crypto.randomUUID();
        setSubmitting(true);
        setError("");
        try {
          const res = await fetch("/api/postex/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer, items, paymentMethod: method, checkoutAttemptId: attemptId.current }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.orderRef) throw new Error(data.error || "We couldn't place your order. Please try again.");

          const order = placeOrder({
            id: data.orderRef,
            items: lines,
            total: Number(data.totalOrderValue ?? total),
            payment: methodLabel[method],
            address: { name: customer.fullName, phone: customer.phone, line: customer.address, city: customer.city },
          });
          clear();
          setPlaced({
            ...order,
            method,
            advance: Number(data.amountPayableInAdvance || 0),
            onDelivery: Number(data.amountPayableOnDelivery || 0),
            details: data.paymentDetails || {},
          });
          window.scrollTo(0, 0);
        } catch (err) {
          setError(err instanceof Error ? err.message : "We couldn't place your order. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div>
        <h1 className="text-4xl font-light tracking-[-0.02em]">Checkout</h1>

        <h2 className="mb-4 mt-10 text-lg">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email (optional)">
            <input name="email" type="email" autoComplete="email" className="field" />
          </Field>
          <Field label="Phone">
            <input name="phone" type="tel" required autoComplete="tel" placeholder="03xxxxxxxxx" pattern="(\+92|0092|92|0)?3\d{2}[\s\-]?\d{7}" title="A Pakistani mobile number, e.g. 03001234567" className="field" />
          </Field>
        </div>

        <h2 className="mb-4 mt-10 text-lg">Delivery address</h2>
        <div className="grid gap-4">
          <Field label="Full name">
            <input name="name" required autoComplete="name" className="field" />
          </Field>
          <Field label="Address">
            <input name="address" required autoComplete="street-address" placeholder="House, street, area" className="field" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City">
              <select name="city" required className="field" defaultValue={cities.includes("Lahore") ? "Lahore" : cities[0]} key={cities.length}>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Postal code (optional)">
              <input name="postal" autoComplete="postal-code" className="field" />
            </Field>
          </div>
          <Field label="Order notes (optional)">
            <input name="notes" placeholder="Landmark, delivery timing" className="field" />
          </Field>
        </div>

        <h2 className="mb-4 mt-10 text-lg">Payment</h2>
        <div className="border-t border-line">
          {payments.map((p) => (
            <label key={p.id} className="flex cursor-pointer gap-4 border-b border-line py-4">
              <input type="radio" name="payment" checked={method === p.id} onChange={() => setPayment(p.id)} className="mt-1 accent-[var(--ink)]" />
              <span>
                <span className="block text-[14px]">{p.label}</span>
                <span className="text-[13px] text-muted">{p.note}</span>
              </span>
            </label>
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-6 border border-sale/30 p-4 text-[14px] text-sale">
            {error}
          </p>
        )}

        <button className="btn mt-10 w-full disabled:opacity-60 sm:w-auto" disabled={submitting || !settings}>
          {submitting ? "Placing order…" : `Place order — ${formatPrice(total)}`}
        </button>
      </div>

      <aside className="order-first -mx-5 self-start bg-sand px-5 py-4 md:mx-0 md:p-8 lg:sticky lg:top-24 lg:order-none">
        <button type="button" onClick={() => setSummaryOpen((o) => !o)} aria-expanded={summaryOpen} className="flex w-full items-center justify-between text-[14px] lg:hidden">
          <span className="flex items-center gap-2">
            {summaryOpen ? "Hide" : "Show"} order summary
            <ChevronDown size={14} className={`transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
          </span>
          <span>{formatPrice(total)}</span>
        </button>
        <div className={`${summaryOpen ? "mt-5 block" : "hidden"} lg:mt-0 lg:block`}>
        <h2 className="hidden text-lg lg:block">Your order</h2>
        <ul className="space-y-4 lg:mt-6">
          {lines.map((l) => {
            const pr = getProduct(l.slug);
            if (!pr) return null;
            return (
              <li key={l.slug + l.size + (l.colour ?? "")} className="flex gap-4 text-[14px]">
                <div className="relative h-20 w-16 shrink-0 bg-stone">
                  <Image src={pr.images[0]} alt={pr.name} fill sizes="64px" className="object-cover" />
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-paper">{l.qty}</span>
                </div>
                <div className="flex-1">
                  <p>{pr.name}</p>
                  <p className="text-xs text-muted">{lineOptions(l)}</p>
                </div>
                <p>{formatPrice(pr.price * l.qty)}</p>
              </li>
            );
          })}
        </ul>
        <dl className="mt-6 space-y-3 border-t border-sand-deep pt-6 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-sand-deep pt-4 text-[16px]">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        </div>
      </aside>
    </form>
  );
}
