import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolution from "@/components/landing/ProblemSolution";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingCalculator from "@/components/landing/PricingCalculator";
import TestimonialsFaq from "@/components/landing/TestimonialsFaq";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-[#FAF8F5] text-[#1C2426] selection:bg-[#1F5E53] selection:text-[#FAF8F5]"
      style={{
        backgroundImage:
          "radial-gradient(at 15% 0%, rgba(212, 180, 131, 0.14) 0px, transparent 48%), radial-gradient(at 85% 8%, rgba(31, 94, 83, 0.09) 0px, transparent 48%)",
      }}
    >
      <LandingNavbar />
      <main>
        <HeroSection />
        <ProblemSolution />
        <FeaturesSection />
        <PricingCalculator />
        <TestimonialsFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
