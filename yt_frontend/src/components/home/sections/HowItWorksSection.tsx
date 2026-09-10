import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StepList } from "@/components/home/StepList";
import { HOME_SECTIONS } from "@/data/content";

export function HowItWorksSection() {
  return (
    <Section>
      <SectionHeading
        className="mb-16"
        title={HOME_SECTIONS.howItWorks.title}
        description={HOME_SECTIONS.howItWorks.description}
      />
      <StepList />
    </Section>
  );
}
