"use client";

import Image from "next/image";
import { useState } from "react";
import { Field } from "@/components/ui";
import { photos } from "@/lib/products";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-2 lg:gap-20 lg:py-20">
      <div>
        <p className="label mb-4 text-muted">Contact</p>
        <h1 className="text-4xl font-light tracking-[-0.02em] md:text-6xl">We&rsquo;re here to help.</h1>
        <p className="mt-6 max-w-md text-[15px] text-muted">Questions about an order, sizing or wholesale? Send a message and we&rsquo;ll reply within one working day.</p>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 border-t border-line pt-8 text-[14px]">
          <div>
            <p className="font-medium">Customer care</p>
            <a href="tel:+923000000000" className="mt-2 block text-muted">+92 300 000 0000</a>
            <a href="mailto:hello@neend.pk" className="block break-all text-muted">hello@neend.pk</a>
          </div>
          <div>
            <p className="font-medium">Hours</p>
            <p className="mt-2 text-muted">Mon – Sat, 10am – 7pm</p>
            <p className="text-muted">Sunday closed</p>
          </div>
          <div>
            <p className="font-medium">Studio</p>
            <p className="mt-2 text-muted">14-B Main Boulevard, Gulberg III</p>
            <p className="text-muted">Lahore, Pakistan</p>
          </div>
          <div>
            <p className="font-medium">WhatsApp</p>
            <a href="https://wa.me/923000000000" className="mt-2 block text-muted">+92 300 000 0000</a>
            <p className="text-muted">Quickest for order updates</p>
          </div>
        </div>

        {sent ? (
          <div className="mt-12 border border-line p-8">
            <p className="text-lg">Thank you — message received.</p>
            <p className="mt-2 text-[14px] text-muted">We&rsquo;ll get back to you within one working day.</p>
          </div>
        ) : (
          <form
            className="mt-12 grid gap-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <Field label="Name">
              <input required className="field" />
            </Field>
            <Field label="Email">
              <input required type="email" className="field" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Order number (optional)">
                <input className="field" placeholder="From your confirmation" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Message">
                <textarea required rows={5} className="field resize-none" />
              </Field>
            </div>
            <button className="btn sm:w-fit">Send message</button>
          </form>
        )}
      </div>

      <div className="relative hidden aspect-[4/5] bg-stone lg:block">
        <Image src={photos.contact} alt="Bedroom" fill sizes="50vw" className="object-cover" />
      </div>
    </div>
  );
}
