import { Section } from "@/components/layout/Section";
import { EvidenceMockup } from "@/components/home/EvidenceMockup";
import { HOME_SECTIONS } from "@/data/content";

export function EvidenceSection() {
  return (
    <Section
      tone="forest"
      innerClassName="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16"
    >
      <div>
        <h2 className="font-display text-cream text-display mb-5">
          {HOME_SECTIONS.evidence.title}
        </h2>
        <p className="text-body-lg text-cream/75">{HOME_SECTIONS.evidence.description}</p>
      </div>
      <EvidenceMockup />
    </Section>
  );
}
