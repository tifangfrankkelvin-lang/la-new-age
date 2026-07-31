"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestOrderLinks } from "./actions";
import { lookupOrderByNumber } from "./lookup-actions";

export default function OrderStatusLookupPage() {
  const router = useRouter();

  // Direct lookup by order number + email
  const [orderNumber, setOrderNumber] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  // Fallback: email me my order links
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookupError(null);
    setLookingUp(true);

    const result = await lookupOrderByNumber(orderNumber, lookupEmail);

    setLookingUp(false);

    if (result.error || !result.token) {
      setLookupError(result.error ?? "Something went wrong.");
      return;
    }

    router.push(`/order/${result.token}`);
  }

  async function handleEmailRequest(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await requestOrderLinks(email);
    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl uppercase text-brand-navy mb-3">
        Track Your Order
      </h1>
      <p className="text-brand-mid text-sm mb-8">
        Enter your order number and email to check its status.
      </p>

      <form onSubmit={handleLookup} className="border border-brand-mid/20 p-5 mb-6">
        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
          Order Number
        </label>
        <input
          required
          placeholder="e.g. 1000"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel mb-4 font-mono"
        />

        <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
          Email Used on the Order
        </label>
        <input
          type="email"
          required
          value={lookupEmail}
          onChange={(e) => setLookupEmail(e.target.value)}
          className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel mb-4"
        />

        {lookupError && (
          <p className="text-sm text-red-600 mb-4">{lookupError}</p>
        )}

        <button
          type="submit"
          disabled={lookingUp}
          className="w-full bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide py-3 hover:bg-brand-orange transition-colors disabled:opacity-50"
        >
          {lookingUp ? "Looking up..." : "Track Order"}
        </button>
      </form>

      <p className="text-xs text-brand-mid text-center mb-4">
        Don&apos;t have your order number?
      </p>

      {submitted ? (
        <div className="border border-dashed border-brand-mid/40 p-4 text-center">
          <p className="text-brand-steel text-sm">
            If we found any orders under <strong>{email}</strong>, we&apos;ve
            emailed you the link(s).
          </p>
        </div>
      ) : (
        <form onSubmit={handleEmailRequest} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Email us your order link"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
          />
          <button
            type="submit"
            disabled={sending}
            className="border border-brand-navy text-brand-navy text-xs font-semibold uppercase tracking-wide px-4 hover:bg-brand-navy hover:text-white transition-colors disabled:opacity-50"
          >
            {sending ? "..." : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}