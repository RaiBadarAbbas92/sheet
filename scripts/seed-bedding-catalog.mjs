// Adds the Neend bedding categories and products to Supabase.
// Safe to re-run: categories upsert on slug, and products whose article number
// already exists are skipped. Nothing else in the shared database is touched.
//
//   node scripts/seed-bedding-catalog.mjs [--stock 50]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const line of readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");

const stockArg = process.argv.indexOf("--stock");
const STOCK = stockArg > -1 ? Number(process.argv[stockArg + 1]) : 50;

async function rest(pathname, { method = "GET", body, prefer } = {}) {
  const res = await fetch(`${url}/rest/v1/${pathname}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${method} ${pathname}: ${data?.message || res.status}`);
  return data;
}

const categories = [
  { name: "Bedsheets", slug: "bedsheets", description: "Three-piece cotton sets: a flat sheet and two pillow covers.", image: "https://images.unsplash.com/photo-1699436639670-1e5799b14aae" },
  { name: "Duvet Covers", slug: "duvet-covers", description: "Soft percale covers with button closures and corner ties.", image: "https://images.unsplash.com/photo-1603087970319-4c90bd58ddeb" },
  { name: "Pillow Covers", slug: "pillow-covers", description: "Made in the same fabrics as our sheets and duvets, so every set matches.", image: "https://images.unsplash.com/photo-1698746044395-85beb2b04522" },
  { name: "Comforter Sets", slug: "comforter-sets", description: "Seven-piece layered sets, filled and ready for winter.", image: "https://images.unsplash.com/photo-1686827986080-8ee55b055a2f" },
  { name: "Fitted Sheets", slug: "fitted-sheets", description: "Deep elasticated pockets for mattresses up to 14 inches.", image: "https://images.unsplash.com/photo-1598535746036-87d13382f6a6" },
].map((c, i) => ({ ...c, parent_slug: null, status: "Active", sort_order: 100 + i * 10 }));

await rest("catalog_categories?on_conflict=slug", { method: "POST", body: categories, prefer: "resolution=merge-duplicates,return=minimal" });
console.log(`Categories: ${categories.length} upserted`);

const seed = JSON.parse(readFileSync(path.join(root, "scripts", "bedding-seed.json"), "utf8"));
const bedSizes = ["Single", "Double", "King", "Super King"];
const pillowSizes = ["Standard 20×30", "King 20×36"];
const descriptions = {
  "Bedsheets": "Three-piece 100% cotton set: one flat sheet and two pillow covers.",
  "Duvet Covers": "Soft cotton percale duvet cover with button closure and corner ties.",
  "Pillow Covers": "A pair of cotton pillow covers made in the same fabric as the matching set.",
  "Comforter Sets": "Seven-piece layered comforter set, filled and ready for winter.",
  "Fitted Sheets": "Cotton fitted sheet with deep elasticated pockets for mattresses up to 14 inches.",
};
const article = (slug) => `NND-${slug.toUpperCase()}`;

const existing = await rest(`products?select=article_number&article_number=in.(${seed.map((p) => `"${article(p.slug)}"`).join(",")})`);
const have = new Set(existing.map((row) => row.article_number));
const fresh = seed.filter((p) => !have.has(article(p.slug)));

if (fresh.length) {
  const rows = fresh.map((p) => ({
    name: p.name,
    description: descriptions[p.category] || "",
    price: p.price,
    category: p.category,
    size: JSON.stringify(p.category === "Pillow Covers" ? pillowSizes : bedSizes),
    color: JSON.stringify([p.colour]),
    img: JSON.stringify(p.images),
    instock: true,
    new: p.isNew,
    bestsellere: false,
    article_number: article(p.slug),
    delivery_fee_mode: "inherit",
    cost_total_pkr: 0,
    cost_breakdown: {
      metadata: {
        status: "Active",
        vendor: "Neend",
        productType: "Bedding",
        urlHandle: p.slug,
        matchHandle: p.match || "",
        compareAtPrice: p.compareAt,
        countryOfOrigin: "Pakistan",
        tags: ["Neend"],
      },
    },
  }));
  const inserted = await rest("products?select=id,article_number", { method: "POST", body: rows, prefer: "return=representation" });
  await rest("inventory", {
    method: "POST",
    body: inserted.map((row) => ({ product_id: row.id, stock_quantity: STOCK, low_stock_threshold: 5, sku: row.article_number })),
    prefer: "return=minimal",
  });
  console.log(`Products: ${inserted.length} added with stock ${STOCK}`);
}
console.log(`Products: ${seed.length - fresh.length} already present, skipped`);
