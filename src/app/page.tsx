import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolution from "@/components/landing/ProblemSolution";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingCalculator from "@/components/landing/PricingCalculator";
import TestimonialsFaq from "@/components/landing/TestimonialsFaq";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-600 selection:text-white">
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
