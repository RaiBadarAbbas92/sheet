"use client";

// Unsplash resizes on its CDN. Other sources (admin uploads, Cloudinary, Supabase
// Storage) are served as stored; the width is still added so each srcset entry is distinct.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) {
    return `${src.split("?")[0]}?auto=format&fit=crop&w=${width}&q=${quality ?? 70}`;
  }
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
