"use client";

import { useState } from "react";
import { Field, PageHero, Split } from "@/components/ui";
import { photos } from "@/lib/products";

export default function WholesalePage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero kicker="Business" title="Wholesale & hospitality" image={photos.wholesale} text="Bedding for hotels, guest houses, hostels and retailers — at trade prices." />
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:py-16 md:px-10 md:py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["From 20 sets", "Trade pricing starts at 20 sets per order."],
            ["Custom sizes", "Made to measure for hotel and non-standard mattresses."],
            ["Your branding", "Embroidered logos and custom packaging available."],
          ].map(([t, d]) => (
            <div key={t} className="border-t border-ink pt-5">
              <p className="text-2xl font-light">{t}</p>
              <p className="mt-2 text-[14px] text-muted">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <Split image={photos.heroA} alt="Hotel style bedroom">
            <h2 className="text-3xl font-light tracking-[-0.02em] md:text-4xl">Request a quote</h2>
            {sent ? (
              <p className="mt-8 border border-line p-6 text-[14px]">Thanks — our trade team will contact you within two working days.</p>
            ) : (
              <form
                className="mt-8 grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field label="Business name">
                  <input required className="field" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Contact person">
                    <input required className="field" />
                  </Field>
                  <Field label="Phone">
                    <input required type="tel" className="field" />
                  </Field>
                </div>
                <Field label="Approximate quantity">
                  <select className="field">
                    <option>20 – 50 sets</option>
                    <option>50 – 200 sets</option>
                    <option>200+ sets</option>
                  </select>
                </Field>
                <Field label="Details">
                  <textarea rows={4} className="field resize-none" />
                </Field>
                <button className="btn w-fit">Send request</button>
              </form>
            )}
          </Split>
        </div>
      </div>
    </>
  );
}
