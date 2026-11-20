import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolution from "@/components/landing/ProblemSolution";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingCalculator from "@/components/landing/PricingCalculator";
import TestimonialsFaq from "@/components/landing/TestimonialsFaq";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] selection:bg-[#141413] selection:text-[#FAF8F5]">
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
