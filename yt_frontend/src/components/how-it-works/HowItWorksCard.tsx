import { Card } from "@/components/ui/Card";
import { ConceptCard } from "@/data/howItWorksData";

interface HowItWorksCardProps {
  concept: ConceptCard;
}

export function HowItWorksCard({ concept }: HowItWorksCardProps) {
  return (
    <Card padding="md" className="flex h-full flex-col">
      <h3 className="mb-2 text-sm font-semibold text-foreground">{concept.title}</h3>
      <p className="mb-3 flex-1 text-sm leading-relaxed text-foreground-soft">
        {concept.description}
      </p>
      <p className="text-body-sm text-foreground-muted">{concept.benefit}</p>
    </Card>
  );
}
