import type { Metadata } from "next";
import TrackOrder from "@/components/track-order";

export const metadata: Metadata = { title: "Track order" };

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <TrackOrder initialId={id ?? ""} />;
}
