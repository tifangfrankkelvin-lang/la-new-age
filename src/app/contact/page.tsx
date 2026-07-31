"use client";

import { useState } from "react";
import { submitContactForm } from "./actions";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const result = await submitContactForm({ name, email, message });
    if (result.error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-brand-orange mb-2">
        Contact
      </p>
      <h1 className="font-display text-4xl uppercase text-brand-navy mb-8">
        Get In Touch
      </h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-brand-steel text-sm leading-relaxed mb-6">
            Have a question about fitment, an order, or a part you&apos;re
            looking for that isn&apos;t listed yet? Send us a message and
            we&apos;ll get back to you as soon as we can.
          </p>
          <div className="space-y-2 text-sm text-brand-steel">
            <p>
              <span className="text-brand-mid">Location:</span> Los Angeles,
              CA
            </p>
            <p>
              <span className="text-brand-mid">Response time:</span> Usually
              within 1 business day
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
              Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-brand-mid block mb-1">
              Message
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-brand-mid/30 text-sm px-3 py-2 text-brand-steel"
            />
          </div>

          {status === "sent" && (
            <p className="text-sm text-green-700">
              Message sent — we&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide py-3 hover:bg-brand-orange transition-colors disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}