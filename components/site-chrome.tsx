"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

/** The admin panel has its own layout, so the storefront header and footer stay off /admin. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname()?.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
