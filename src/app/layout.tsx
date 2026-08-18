import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

import { siteUrl } from "./seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  display: "swap",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Arsenia Balinario | SkyBound Travel Hub Flight Assistance",
  description:
    "Chat directly with Arsenia Balinario at SkyBound Travel Hub for local and international flight options and clear booking guidance.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Arsenia Balinario | SkyBound Travel Hub",
    description:
      "Personal help from Arsenia Balinario for local and international flight options.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
      data-atmosphere={
        process.env.NEXT_PUBLIC_ATMOSPHERE === "off" ? "off" : undefined
      }
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
