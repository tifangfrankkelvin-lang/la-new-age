import Link from "next/link";

const SHOP_LINKS = [
  { href: "/shop", label: "All Parts" },
  { href: "/shop?category=brakes", label: "Brakes" },
  { href: "/shop?category=suspension", label: "Suspension" },
  { href: "/shop?category=lighting", label: "Lighting" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/order-status", label: "Track an Order" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand blurb */}
        <div className="md:col-span-2">
          <span className="font-display text-lg uppercase tracking-wide">
            L.A New Age
          </span>
          <p className="mt-3 text-sm text-white/70 max-w-sm leading-relaxed">
            Quality truck parts, sourced and sold out of Los Angeles.
            Shipping nationwide, with local pickup available for LA-area
            buyers.
          </p>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-orange mb-4">
            Shop
          </h3>
          <ul className="space-y-2">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company links */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-orange mb-4">
            Company
          </h3>
          <ul className="space-y-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} L.A New Age. All rights reserved.</p>
          <p>Los Angeles, CA</p>
        </div>
      </div>
    </footer>
  );
}