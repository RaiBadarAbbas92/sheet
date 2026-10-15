import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, PageHero } from "@/components/ui";
import { photos } from "@/lib/products";

export const metadata: Metadata = { title: "FAQs" };

const groups = [
  {
    title: "Orders & payment",
    items: [
      { q: "How do I place an order?", a: "Add products to your cart, go to checkout, enter your address and choose a payment method. You'll get an order number straight away." },
      { q: "Which payment methods do you accept?", a: "Cash on delivery or bank transfer in advance (with free delivery). Card payments are coming soon." },
      { q: "Can I change or cancel my order?", a: "Yes, as long as it hasn't shipped. Message us on WhatsApp with your order number within 12 hours of ordering." },
    ],
  },
  {
    title: "Delivery",
    items: [
      { q: "How long does delivery take?", a: "2–4 working days to major cities and 4–6 working days elsewhere in Pakistan." },
      { q: "How much is delivery?", a: "Rs. 250 per order, and free on orders over Rs. 5,000." },
      { q: "How can I track my order?", a: <>Use the <Link href="/track-order" className="underline underline-offset-4">track order</Link> page with your order number and phone.</> },
    ],
  },
  {
    title: "Products",
    items: [
      { q: "What are your sheets made of?", a: "100% cotton percale with a 300 thread count. No polyester blends." },
      { q: "Will the colours fade?", a: "We use reactive dyes, which bond with the fibre. Wash cold and avoid bleach to keep colours at their best." },
      { q: "Which size should I buy?", a: <>See the <Link href="/size-guide" className="underline underline-offset-4">size guide</Link> for exact measurements.</> },
    ],
  },
  {
    title: "Exchanges",
    items: [
      { q: "What is your exchange policy?", a: <>Unused items in original packaging can be exchanged within 7 days. <Link href="/exchanges" className="underline underline-offset-4">Read the full policy</Link>.</> },
      { q: "Do you offer refunds?", a: "Refunds are given for faulty or incorrect items. Otherwise we offer an exchange or store credit." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero kicker="Help" title="Frequently asked questions" image={photos.faq} />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-12 sm:py-16 md:px-10 lg:grid-cols-[1fr_2fr] lg:py-24">
        <div>
          <p className="text-[14px] text-muted">Can&rsquo;t find what you&rsquo;re looking for?</p>
          <Link href="/contact" className="btn btn-outline mt-4">
            Contact us
          </Link>
        </div>
        <div className="space-y-14">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="mb-4 text-xl">{g.title}</h2>
              <Accordion items={g.items} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
