import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "THAHAMA:market - Freshness Everyday",
  description: "Fastest-growing supermarket in Saudi Arabia & UAE. Quality products, fresh produce, and exceptional service.",
  keywords: ["supermarket", "grocery", "fresh produce", "Saudi Arabia", "UAE", "Jeddah", "Thahama"],
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
