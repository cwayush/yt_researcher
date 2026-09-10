import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { ProductExplanationSection } from "@/components/home/sections/ProductExplanationSection";
import { HowItWorksSection } from "@/components/home/sections/HowItWorksSection";
import { EvidenceSection } from "@/components/home/sections/EvidenceSection";
import { AskAnythingSection } from "@/components/home/sections/AskAnythingSection";
import { GroundedSection } from "@/components/home/sections/GroundedSection";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useHistory } from "@/hooks/useHistory";
import { demoVideo } from "@/data/demo";

export function HomeScreen() {
  const { goWorkspace, startAnalysis } = useAppNavigation();
  const { history } = useHistory();

  const openDemo = () => goWorkspace(history[0]?.id ?? demoVideo.id);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection onAnalyze={startAnalysis} onOpenDemo={openDemo} />
      <ProductExplanationSection />
      <HowItWorksSection />
      <EvidenceSection />
      <AskAnythingSection />
      <GroundedSection />
      <Footer />
    </div>
  );
}
