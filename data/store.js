// The Neend storefront and admin only deal in bedding.
export const BEDDING_CATEGORIES = [
  "Bedsheets",
  "Fitted Sheets",
  "Duvet Covers",
  "Comforter Sets",
  "Pillow Covers",
  "Mattress Protectors",
  "Quilts & Blankets",
];
export const categories = ["All", ...BEDDING_CATEGORIES];
const categoryMetaSeparator = "||";

const categoryAliases = {
  bedsheet: "Bedsheets",
  "bed sheet": "Bedsheets",
  "bed sheets": "Bedsheets",
  "fitted sheet": "Fitted Sheets",
  "duvet cover": "Duvet Covers",
  "comforter set": "Comforter Sets",
  comforter: "Comforter Sets",
  comforters: "Comforter Sets",
  "pillow cover": "Pillow Covers",
  pillowcase: "Pillow Covers",
  pillowcases: "Pillow Covers",
  "mattress protector": "Mattress Protectors",
  quilt: "Quilts & Blankets",
  quilts: "Quilts & Blankets",
  blanket: "Quilts & Blankets",
  blankets: "Quilts & Blankets",
  "quilts and blankets": "Quilts & Blankets",
};

export function normalizeCategory(value) {
  const raw = String(value || "").split(categoryMetaSeparator)[0].trim();
  if (!raw) return "Uncategorized";
  const key = raw
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");

  return categoryAliases[key] || categories.find((category) => category.toLowerCase() === raw.toLowerCase()) || raw;
}

export function slugifyCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryToSlug(value) {
  const normalized = normalizeCategory(value);
  if (normalized === "Co-ord Sets") return "coord-sets";
  return slugifyCategory(normalized);
}

export function parseCategorySelection(value) {
  const [category = "", subcategory = "", collection = ""] = String(value || "")
    .split(categoryMetaSeparator)
    .map((part) => part.trim());

  return {
    category: normalizeCategory(category),
    subcategory,
    collection,
  };
}

export function formatCategorySelection({ category, subcategory = "", collection = "" }) {
  const normalizedCategory = normalizeCategory(category);
  const cleanSubcategory = String(subcategory || "").trim();
  const cleanCollection = String(collection || "").trim();
  if (!cleanSubcategory && !cleanCollection) return normalizedCategory;
  return [normalizedCategory, cleanSubcategory, cleanCollection].join(categoryMetaSeparator);
}

export const categoryDetails = {
  "bedsheets": {
    name: "Bedsheets",
    description: "Cotton bedsheet sets with pillow covers, delivered across Pakistan.",
    image: "https://images.unsplash.com/photo-1699436639670-1e5799b14aae",
  },
  "fitted-sheets": {
    name: "Fitted Sheets",
    description: "Elasticated fitted sheets that stay put on every mattress size.",
    image: "https://images.unsplash.com/photo-1598535746036-87d13382f6a6",
  },
  "duvet-covers": {
    name: "Duvet Covers",
    description: "Soft cotton duvet covers in plain colours and prints.",
    image: "https://images.unsplash.com/photo-1603087970319-4c90bd58ddeb",
  },
  "comforter-sets": {
    name: "Comforter Sets",
    description: "Filled comforters with matching sheets and pillow covers.",
    image: "https://images.unsplash.com/photo-1686827986080-8ee55b055a2f",
  },
  "pillow-covers": {
    name: "Pillow Covers",
    description: "Pillow covers made to match our bedsheets and duvet sets.",
    image: "https://images.unsplash.com/photo-1698746044395-85beb2b04522",
  },
  "mattress-protectors": {
    name: "Mattress Protectors",
    description: "Waterproof, breathable protectors that keep your mattress fresh.",
    image: "https://images.unsplash.com/photo-1631048501851-4aa85ffc3be8",
  },
  "quilts-and-blankets": {
    name: "Quilts & Blankets",
    description: "Warm quilts and blankets for winter nights.",
    image: "https://images.unsplash.com/photo-1684841566323-24a0a9961f19",
  },
};

// No offline catalogue: if Supabase is unreachable the storefront shows nothing
// rather than products that checkout would reject.
export const products = [];


