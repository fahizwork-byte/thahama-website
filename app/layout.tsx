import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import { LanguageProvider } from "./i18n/LanguageContext";
import { DeviceProvider } from "./context/DeviceContext";
import { cookieName, fallbackLng } from "./i18n/settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "THAHAMA:market - Freshness Everyday",
  description: "Fastest-growing supermarket in Saudi Arabia & UAE. Quality products, fresh produce, and exceptional service.",
  keywords: ["supermarket", "grocery", "fresh produce", "Saudi Arabia", "UAE", "Jeddah", "Thahama"],
  authors: [{ name: "THAHAMA:market" }],
  creator: "THAHAMA:market",
  publisher: "THAHAMA:market",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://thahama-market.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "THAHAMA:market",
    title: "THAHAMA:market - Freshness Everyday",
    description: "Fastest-growing supermarket in Saudi Arabia & UAE. Quality products, fresh produce, and exceptional service.",
    images: [
      {
        url: "/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.webp",
        width: 1200,
        height: 630,
        alt: "THAHAMA:market - Freshness Everyday",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THAHAMA:market - Freshness Everyday",
    description: "Fastest-growing supermarket in Saudi Arabia & UAE. Quality products, fresh produce, and exceptional service.",
    images: ["/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.webp"],
    creator: "@thahamamarket",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get(cookieName)?.value || fallbackLng;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        {/* Preload critical hero image for faster LCP */}
        <link
          rel="preload"
          href="/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.webp"
          as="image"
          fetchPriority="high"
        />
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Font preloading - Next.js will optimize this, but explicit hints can help */}
        {/* Note: Next.js font optimization already handles this, but explicit hints can help */}
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <DeviceProvider>
          <LanguageProvider initialLanguage={lang}>
            {/* Structured Data (JSON-LD) for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Store",
                name: "THAHAMA:market",
                description: "Fastest-growing supermarket in Saudi Arabia & UAE. Quality products, fresh produce, and exceptional service.",
                url: process.env.NEXT_PUBLIC_SITE_URL || "https://thahama-market.com",
                logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://thahama-market.com"}/logos/thahama.svg`,
                image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://thahama-market.com"}/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.webp`,
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "SA",
                  addressLocality: "Jeddah",
                },
                priceRange: "$$",
                servesCuisine: "Grocery",
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    opens: "08:00",
                    closes: "23:00",
                  },
                ],
              }),
            }}
          />
            {children}
            <ServiceWorkerRegistration />
          </LanguageProvider>
        </DeviceProvider>
      </body>
    </html>
  );
}
