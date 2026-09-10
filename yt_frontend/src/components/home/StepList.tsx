import { HOME_STEPS } from "@/data/content";

// Numbered vertical timeline for the "From YouTube link to evidence" section.
export function StepList() {
  return (
    <div className="flex flex-col">
      {HOME_STEPS.map(({ num, step, desc }, i) => (
        <div key={num} className="flex gap-5">
          <div className="flex flex-col items-center">
            <span className="border-border-strong bg-surface-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
              <span className="font-mono-ts text-micro text-foreground-muted">{num}</span>
            </span>
            {i < HOME_STEPS.length - 1 && (
              <span className="bg-surface-muted my-1 min-h-8 w-px flex-1" aria-hidden="true" />
            )}
          </div>
          <div className="pb-10">
            <p className="text-foreground mb-1 text-base font-semibold">{step}</p>
            <p className="text-foreground-soft text-sm leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
