import { cache } from "react";
import { CATALOG_CACHE_TAG, getCatalogProducts } from "./catalog";
import { getCatalogCategories } from "./categories";
import { FALLBACK_PRODUCT_IMAGE } from "./brand";
import type { Product, StoreCategory } from "./products";

type CatalogRow = {
  id: string | number;
  name: string;
  description?: string;
  fabricDetails?: string;
  careInstructions?: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  articleNumber?: string;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  cost_breakdown?: { metadata?: { urlHandle?: string; matchHandle?: string } };
};

type CategoryRow = { name: string; slug: string; image?: string; description?: string; parentSlug?: string; status?: string };

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function toProduct(row: CatalogRow): Product {
  const meta = row.cost_breakdown?.metadata ?? {};
  const colours = (row.colors ?? []).map(String).filter(Boolean);
  const price = Number(row.price || 0);
  const compareAt = Number(row.compareAtPrice || 0);
  const images = (row.images ?? []).filter(Boolean);
  return {
    id: String(row.id),
    articleNumber: row.articleNumber ?? "",
    // The admin's "URL handle" when set, otherwise the name plus a short id so slugs stay unique.
    slug: meta.urlHandle?.trim() || `${slugify(row.name) || "product"}-${String(row.id).slice(0, 6)}`,
    name: row.name,
    description: row.description ?? "",
    fabricDetails: row.fabricDetails ?? "",
    careInstructions: row.careInstructions ?? "",
    category: row.category,
    price,
    compareAt: compareAt > price ? compareAt : price,
    images: images.length ? images : [FALLBACK_PRODUCT_IMAGE],
    colour: colours[0] ?? "",
    colours,
    sizes: (row.sizes ?? []).map(String).filter(Boolean),
    stock: Math.max(0, Number(row.stock ?? 0)),
    isNew: Boolean(row.isNew),
    isBestseller: Boolean(row.isBestseller),
    match: meta.matchHandle?.trim() || undefined,
  };
}

/**
 * Every product the admin has marked Active, newest first. Sold-out products
 * stay listed (marked "Sold out"); archived and draft ones are left out by
 * getCatalogProducts.
 */
export const getStoreProducts = cache(async (): Promise<Product[]> => {
  const rows = (await getCatalogProducts()) as CatalogRow[];
  return rows.map(toProduct);
});

/**
 * Top-level categories from the admin that have at least one product, in the
 * admin's order, followed by any category a product uses that the admin has
 * not set up as a category record.
 */
export const getStoreCategories = cache(async (): Promise<StoreCategory[]> => {
  const [products, records] = await Promise.all([
    getStoreProducts(),
    (getCatalogCategories({ admin: true, cacheOptions: { revalidate: 300, tags: [CATALOG_CACHE_TAG] } }) as Promise<CategoryRow[]>).catch(() => [] as CategoryRow[]),
  ]);
  const used = new Set(products.map((p) => p.category));
  const listed = records.filter((c) => !c.parentSlug && c.status === "Active" && used.has(c.name));
  const names = [...listed.map((c) => c.name), ...[...used].filter((n) => !listed.some((c) => c.name === n))];

  return names.map((name) => {
    const record = listed.find((c) => c.name === name);
    const photos = products.filter((p) => p.category === name).map((p) => p.images[0]);
    const ownImage = record?.image && !record.image.startsWith(FALLBACK_PRODUCT_IMAGE) ? record.image : "";
    return {
      name,
      slug: record?.slug || slugify(name),
      image: ownImage || photos[0] || FALLBACK_PRODUCT_IMAGE,
      blurb: record?.description ?? "",
      banner: photos.slice(0, 3),
    };
  });
});
