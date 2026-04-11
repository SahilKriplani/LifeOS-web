import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import FooterSection from "@/components/landing/FooterSection";

export default function LandingPage() {
  return (
    <main
      className="min-h-screen relative"
      style={{ background: "var(--background)" }}
    >
      {/* Global background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--secondary)" }}
        />
      </div>

      <div className="relative z-10">
        <LandingNavbar />
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <FooterSection />
      </div>
    </main>
  );
}
