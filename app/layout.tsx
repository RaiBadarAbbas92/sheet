import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { AccountProvider } from "@/components/account-store";
import { CatalogProvider } from "@/components/catalog";
import SiteChrome from "@/components/site-chrome";
import { getStoreCategories, getStoreProducts } from "@/lib/store-catalog";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Neend Mattress — Bedding", template: "%s — Neend Mattress" },
  description: "Cotton bedsheets, comforters and duvet covers. Delivered across Pakistan.",
};

// viewport-fit=cover lets fixed bars pad themselves with env(safe-area-inset-bottom) on notched phones.
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f6f2ec" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [products, categories] = await Promise.all([getStoreProducts(), getStoreCategories()]);
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen">
        <CatalogProvider products={products} categories={categories}>
          <AccountProvider>
            <CartProvider>
              <SiteChrome>{children}</SiteChrome>
            </CartProvider>
          </AccountProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
