import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GroundedExamples } from "@/components/home/GroundedExamples";
import { HOME_SECTIONS } from "@/data/content";

export function GroundedSection() {
  return (
    <Section>
      <SectionHeading
        className="mb-14"
        title={HOME_SECTIONS.grounded.title}
        description={HOME_SECTIONS.grounded.description}
        descriptionWidth="max-w-narrow"
      />
      <GroundedExamples />
    </Section>
  );
}
