import CTASection from "./cta-section";
import HowItWorksSection from "./how-it-works-section";

export default function CombinedCTAHowSection() {
  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <CTASection />
          <HowItWorksSection />
        </div>
      </div>
    </section>
  );
}
