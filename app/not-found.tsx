import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-20 sm:py-32 text-center">
      <p className="label text-muted">404</p>
      <h1 className="mt-4 text-4xl font-light">Page not found</h1>
      <p className="mt-4 text-[14px] text-muted">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <Link href="/shop" className="btn mt-8">
        Shop now
      </Link>
    </div>
  );
}
