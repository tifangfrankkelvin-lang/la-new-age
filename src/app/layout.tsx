import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import FloatingCartButton from "@/components/FloatingCartButton";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "L.A New Age | Truck Parts, Los Angeles",
  description:
    "Quality truck parts in Los Angeles. Browse by make, model, and year, with shipping and local pickup available.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "L.A New Age",
    title: "L.A New Age | Truck Parts, Los Angeles",
    description:
      "Quality truck parts in Los Angeles. Browse by make, model, and year, with shipping and local pickup available.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "L.A New Age | Truck Parts, Los Angeles",
    description:
      "Quality truck parts in Los Angeles. Browse truck parts online with shipping and local pickup available.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "L.A New Age",
  url: siteUrl,
  description:
    "Truck parts in Los Angeles with shipping and local pickup available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}