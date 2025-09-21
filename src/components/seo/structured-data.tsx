interface StructuredDataProps {
  type: "website" | "organization";
}

export function StructuredData({ type }: StructuredDataProps) {
  const websiteData = {
    "@type": "WebSite",
    "@id": "https://moviefy-io.vercel.app/#website",
    url: "https://moviefy-io.vercel.app",
    name: "Moviefy",
    description:
      "Organize your movies, series, and anime. Track progress across multiple platforms and never lose your place again.",
    inLanguage: "en-US",
  };

  const organizationData = {
    "@type": "Organization",
    "@id": "https://moviefy-io.vercel.app/#organization",
    name: "Moviefy",
    url: "https://moviefy-io.vercel.app",
    description:
      "The ultimate entertainment organizer for movies, TV series, and anime",
    foundingDate: "2024",
  };

  const data = type === "website" ? websiteData : organizationData;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    ...data,
  });

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      // biome-ignore lint: Structured data requires dangerouslySetInnerHTML
      dangerouslySetInnerHTML={{
        __html: jsonLd,
      }}
    />
  );
}
