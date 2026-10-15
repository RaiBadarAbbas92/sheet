// Store identity used by the API and admin. The Supabase project is shared with
// another storefront, so orders placed here are tagged with BRAND_TAG.
export const BRAND_NAME = "Neend Mattress";
// Kept as "Neend" so orders placed before the rename still match the same admin filter.
export const BRAND_TAG = "Neend";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://neend.pk").replace(/\/+$/, "");
export const ORDER_PREFIX = "NND";
export const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1631048501851-4aa85ffc3be8";
export const FREE_DELIVERY_OVER_PKR = 5000;
