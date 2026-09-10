import { HOME_FEATURES } from "@/data/content";

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
      {HOME_FEATURES.map(({ num, heading, body }) => (
        <div key={num}>
          <h3 className="font-display text-h3 text-foreground mb-2">
            {num}: {heading}
          </h3>
          <p className="text-foreground-soft text-sm leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  );
}
