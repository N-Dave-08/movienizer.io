import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { StructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "MovieNizer - Organize Your Entertainment Collection",
  description:
    "The ultimate movie, TV series, and anime organizer. Track your progress across platforms, discover new content, and never lose your place again. Start organizing your entertainment today!",
  openGraph: {
    title: "MovieNizer - Organize Your Entertainment Collection",
    description:
      "The ultimate movie, TV series, and anime organizer. Track your progress across platforms, discover new content, and never lose your place again.",
    type: "website",
    url: "https://movienizer-io.vercel.app",
  },
  twitter: {
    title: "MovieNizer - Organize Your Entertainment Collection",
    description:
      "The ultimate movie, TV series, and anime organizer. Track your progress across platforms, discover new content, and never lose your place again.",
  },
};

// Dynamic imports for code splitting
const HeroSection = dynamic(() => import("./_components/hero-section"), {
  loading: () => (
    <div className="hero bg-gradient-to-br from-primary/10 to-secondary/10 min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ),
});

const FeaturesSection = dynamic(
  () => import("./_components/features-section"),
  {
    loading: () => (
      <div className="py-20 bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    ),
  },
);

const CombinedCTAHowSection = dynamic(
  () => import("./_components/combined-cta-how-section"),
  {
    loading: () => (
      <div className="py-20 bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    ),
  },
);

const Footer = dynamic(() => import("./_components/footer"), {
  loading: () => (
    <div className="p-10 bg-base-200 flex items-center justify-center">
      <span className="loading loading-spinner loading-sm"></span>
    </div>
  ),
});

export default function HomePage() {
  return (
    <>
      <StructuredData type="website" />
      <StructuredData type="organization" />
      <HeroSection />
      <FeaturesSection />
      <CombinedCTAHowSection />
      <Footer />
    </>
  );
}
