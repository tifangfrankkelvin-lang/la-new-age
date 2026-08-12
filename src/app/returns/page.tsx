import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds | L.A New Age",
  description:
    "L.A New Age's returns and refund policy — 14-day return window, refunds by original payment method.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-brand-orange mb-2">
        Policy
      </p>
      <h1 className="font-display text-4xl uppercase text-brand-navy mb-8">
        Returns &amp; Refunds
      </h1>

      <div className="space-y-6 text-brand-steel leading-relaxed text-sm">
        <div>
          <h2 className="font-display text-lg text-brand-navy uppercase mb-2">
            14-Day Return Window
          </h2>
          <p>
            We accept returns within 14 days of delivery or pickup. Parts
            must be unused and uninstalled, in the same condition they were
            sent in.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg text-brand-navy uppercase mb-2">
            How to Start a Return
          </h2>
          <p>
            Contact us with your order number and the reason for the return
            before sending anything back. We&apos;ll confirm the return and
            walk you through next steps.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg text-brand-navy uppercase mb-2">
            Return Shipping
          </h2>
          <p>
            If a part is defective, damaged, or not what you ordered, we
            cover return shipping. For change-of-mind returns, the customer
            is responsible for return shipping costs.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg text-brand-navy uppercase mb-2">
            Refunds
          </h2>
          <p>
            Once we receive and inspect the returned part, we issue your
            refund manually through the same payment method used for the
            original order. Refunds are typically processed within a few
            business days of receiving the return.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg text-brand-navy uppercase mb-2">
            Questions?
          </h2>
          <p>
            Reach out on our{" "}
            <Link href="/contact" className="text-brand-orange hover:underline">
              Contact page
            </Link>{" "}
            before ordering if you're unsure about fitment or condition — we'd
            rather help you get it right the first time.
          </p>
        </div>
      </div>
    </div>
  );
}