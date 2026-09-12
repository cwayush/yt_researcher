import { HowItWorksGroup } from "@/components/how-it-works/HowItWorksGroup";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { HOW_IT_WORKS_GROUPS } from "@/data/howItWorksData";

export function HowItWorksScreen() {
  return (
    <div className="flex flex-1 flex-col">
      <PageContainer className="flex-1 py-16">
        <div className="mb-10 max-w-measure">
          <h1 className="font-display mb-3 text-foreground text-display">How it works</h1>
          <p className="text-body-lg leading-relaxed text-foreground-soft">
            The engineering ideas behind turning a video into grounded, evidence-backed answers.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {HOW_IT_WORKS_GROUPS.map((group) => (
            <HowItWorksGroup key={group.id} group={group} />
          ))}
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
}
