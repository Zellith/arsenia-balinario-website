import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

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

const deploymentUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;
const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    deploymentUrl ??
    "https://arsenia-balinario-website.vercel.app",
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "SkyBound Travel Hub | Personal Flight Help on Messenger",
  description:
    "Chat directly with Arsenia at SkyBound Travel Hub for local and international flight options and clear booking guidance.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "SkyBound Travel Hub with Arsenia",
    description:
      "A simpler, more personal way to ask about local and international flights.",
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
