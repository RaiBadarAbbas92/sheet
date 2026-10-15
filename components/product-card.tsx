"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart";
import { defaultSize, discount, formatPrice, isSoldOut, type Product } from "@/lib/products";

export default function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const { add } = useCart();
  const soldOut = isSoldOut(product);
  // Products with several sizes or colours are chosen on the product page.
  const hasOptions = product.sizes.length > 1 || product.colours.length > 1;

  return (
    <article className="flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[3/4] bg-stone" aria-label={product.name}>
        <Image src={product.images[0]} alt={product.name} fill sizes={sizes} className={`object-cover ${soldOut ? "opacity-60" : ""}`} />
        {soldOut ? (
          <span className="label absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] text-paper">Sold out</span>
        ) : (
          product.isNew && <span className="label absolute left-3 top-3 bg-paper px-2 py-1 text-[10px]">New</span>
        )}
      </Link>
      <Link href={`/product/${product.slug}`} className="mb-3 mt-3 block text-[13px]">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <h3>{product.name}</h3>
          {product.colour && <span className="text-xs text-muted sm:text-[13px]">{product.colours.length > 1 ? `${product.colours.length} colours` : product.colour}</span>}
        </div>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className={`font-medium ${discount(product) > 0 ? "text-sale" : ""}`}>{formatPrice(product.price)}</span>
          {discount(product) > 0 && <span className="text-muted line-through">{formatPrice(product.compareAt)}</span>}
          {discount(product) > 0 && <span className="text-xs text-muted">−{discount(product)}%</span>}
        </p>
      </Link>
      {soldOut ? (
        <button disabled className="btn btn-outline mt-auto w-full px-2 py-3">
          Sold out
        </button>
      ) : hasOptions ? (
        <Link href={`/product/${product.slug}`} className="btn btn-outline mt-auto w-full px-2 py-3">
          Choose options
        </Link>
      ) : (
        <button onClick={() => add(product.slug, defaultSize(product), 1, true, product.colour)} className="btn btn-outline mt-auto w-full px-2 py-3">
          Add to cart
        </button>
      )}
    </article>
  );
}
