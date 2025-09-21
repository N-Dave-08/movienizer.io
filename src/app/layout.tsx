import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import Header from "@/components/ui/header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moviefy-io.vercel.app"),
  title: {
    default: "Moviefy - Your Ultimate Entertainment Organizer",
    template: "%s | Moviefy",
  },
  description:
    "Organize your movies, series, and anime. Track progress across multiple platforms and never lose your place again. Discover new content and manage your watchlist effortlessly.",
  keywords: [
    "movie organizer",
    "tv series tracker",
    "anime watchlist",
    "entertainment tracker",
    "movie database",
    "watchlist manager",
    "streaming tracker",
    "movie collection",
    "tv show organizer",
  ],
  authors: [{ name: "Moviefy Team" }],
  creator: "Moviefy",
  publisher: "Moviefy",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moviefy-io.vercel.app",
    title: "Moviefy - Your Ultimate Entertainment Organizer",
    description:
      "Organize your movies, series, and anime. Track progress across multiple platforms and never lose your place again.",
    siteName: "Moviefy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moviefy - Entertainment Organizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moviefy - Your Ultimate Entertainment Organizer",
    description:
      "Organize your movies, series, and anime. Track progress across multiple platforms.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "v1lmb2ARdnesb7MkuC-c5xCCVp1OW0tkaglblkgWzmI",
  },
  alternates: {
    canonical: "https://moviefy-io.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dracula">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d232a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AppProviders>
          <Header />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
