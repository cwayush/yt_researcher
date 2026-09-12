import { HowItWorksCard } from "@/components/how-it-works/HowItWorksCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ConceptGroup } from "@/data/howItWorksData";

interface HowItWorksGroupProps {
  group: ConceptGroup;
}

export function HowItWorksGroup({ group }: HowItWorksGroupProps) {
  return (
    <div>
      <SectionHeading title={group.title} description={group.intro} className="mb-6" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.concepts.map((concept) => (
          <HowItWorksCard key={concept.id} concept={concept} />
        ))}
      </div>
    </div>
  );
}
