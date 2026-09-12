import { Button } from "@/components/ui/Button";
import { UrlInput } from "@/components/home/UrlInput";
import { HOME_HERO } from "@/data/content";

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  onOpenRecent?: () => void;
}

export function HeroSection({ onAnalyze, onOpenRecent }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center px-6 pt-16 pb-20 text-center md:pt-24 md:pb-28">
      <div className="w-full max-w-hero">
        <h1 className="font-display text-foreground text-display-xl mb-6">{HOME_HERO.title}</h1>

        {HOME_HERO.intro.map((paragraph, i) => (
          <p
            key={paragraph}
            className={`text-foreground-soft text-lead mx-auto max-w-measure ${i === 0 ? "mb-4" : "mb-10"}`}
          >
            {paragraph}
          </p>
        ))}

        <div className="mx-auto mb-3 w-full max-w-input">
          <UrlInput onAnalyze={onAnalyze} large autoFocus />
        </div>

        <p className="text-foreground-muted mt-3 text-sm">{HOME_HERO.inputHint}</p>
        {onOpenRecent && (
          <Button variant="link" size="bare" className="mt-3 text-sm" onClick={onOpenRecent}>
            {HOME_HERO.recentLink} &rarr;
          </Button>
        )}
      </div>
    </section>
  );
}
