import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | L.A New Age Truck Parts",
  description:
    "Answers to common questions about buying truck parts from L.A New Age — fitment, condition, payment, shipping, pickup, and order tracking.",
};

const FAQS = [
  {
    q: "How do I know a part will fit my truck?",
    a: "Every listing includes the specific make, model, and year range it fits, along with the part number. If you're not sure a part matches your truck, reach out through the Contact page with your truck's year, make, and model before ordering — we're happy to double check.",
  },
  {
    q: "Are your parts new or used?",
    a: "Both — it varies by listing. Each product page clearly shows whether that specific part is new or used, right next to the category label.",
  },
  {
    q: "How does payment work?",
    a: "After you submit an order, we email you payment instructions directly, based on the payment method you selected (Zelle, Apple Pay, Cash App, PayPal, crypto, or another method you specify). We don't collect payment on the site itself.",
  },
  {
    q: "How do I track my order?",
    a: "Every order gets a confirmation email with a status link, plus a 4-digit order number. You can look up your order anytime on our Track Order page using that number and your email.",
  },
  {
    q: "Can I cancel an order?",
    a: "Yes — as long as it hasn't already been marked paid or fulfilled, you can cancel it yourself from your order status page, or contact us directly and we'll cancel it for you.",
  },
  {
    q: "Do you ship, or is it pickup only?",
    a: "Both. You can choose shipping or local pickup (by arrangement) in the Los Angeles area when you place your order.",
  },
  {
    q: "What if I have a question about a specific part before ordering?",
    a: "Reach out through the Contact page — we'd rather answer a fitment or condition question upfront than deal with a return after the fact.",
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-xs uppercase tracking-widest text-brand-orange mb-2">
        FAQ
      </p>
      <h1 className="font-display text-4xl uppercase text-brand-navy mb-8">
        Common Questions
      </h1>

      <div className="divide-y divide-brand-mid/20 border-t border-b border-brand-mid/20">
        {FAQS.map((item) => (
          <div key={item.q} className="py-5">
            <h2 className="font-display text-lg text-brand-navy uppercase mb-2">
              {item.q}
            </h2>
            <p className="text-brand-steel text-sm leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm text-brand-mid mt-8 text-center">
        Still have a question?{" "}
        <Link href="/contact" className="text-brand-orange hover:underline">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}