"use client";

import Link from "next/link";
import { CartLines, FREE_SHIPPING, SHIPPING_FEE, useCart } from "@/components/cart";
import ProductCard from "@/components/product-card";
import { formatPrice } from "@/lib/products";
import { useCatalog } from "@/components/catalog";

export default function CartPage() {
  const { lines, subtotal, count } = useCart();
  const { products } = useCatalog();

  // Cash-on-delivery estimate; paying in advance is always delivered free (see lib/paymentRules.js).
  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:py-20 md:px-10">
        <div className="mx-auto max-w-md py-10 text-center">
          <h1 className="text-4xl font-light">Your cart is empty</h1>
          <p className="mt-4 text-[14px] text-muted">Find something you like in the shop.</p>
          <Link href="/shop" className="btn mt-8">
            Shop now
          </Link>
        </div>
        <h2 className="mb-8 mt-16 text-2xl font-light">Popular right now</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
      <div>
        <h1 className="mb-8 text-4xl font-light tracking-[-0.02em]">Cart ({count})</h1>
        <CartLines />
        <Link href="/shop" className="mt-6 inline-block text-[13px] underline underline-offset-4">
          Continue shopping
        </Link>
      </div>

      <aside className="self-start bg-sand p-6 md:p-8 lg:sticky lg:top-24">
        <h2 className="text-lg">Order summary</h2>
        <dl className="mt-6 space-y-3 text-[14px]">
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

        <Link href="/checkout" className="btn mt-6 w-full">
          Checkout
        </Link>
        <p className="mt-3 text-center text-xs text-muted">Cash on delivery available</p>
      </aside>
    </div>
  );
}
