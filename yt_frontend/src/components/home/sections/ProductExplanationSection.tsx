import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { HOME_SECTIONS } from "@/data/content";

export function ProductExplanationSection() {
  return (
    <Section tone="surface" border="y">
      <SectionHeading
        className="mb-16"
        title={HOME_SECTIONS.explanation.title}
        description={HOME_SECTIONS.explanation.description}
      />
      <FeatureGrid />
    </Section>
  );
}
