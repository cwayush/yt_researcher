import { Section } from "@/components/layout/Section";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { ResearchMockup } from "@/components/home/ResearchMockup";
import { QuestionButton } from "@/components/research/QuestionButton";
import { HOME_QUESTION_PROMPTS, HOME_SECTIONS } from "@/data/content";

export function AskAnythingSection() {
  return (
    <Section
      tone="surface"
      border="y"
      innerClassName="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16"
    >
      <div>
        <h2 className="font-display text-foreground text-display mb-4">
          {HOME_SECTIONS.ask.title}
        </h2>
        <p className="text-body-lg text-foreground-soft mb-8">{HOME_SECTIONS.ask.description}</p>

        <EyebrowLabel as="h3" className="mb-4">
          {HOME_SECTIONS.ask.promptsLabel}
        </EyebrowLabel>
        <div className="flex flex-col gap-2">
          {HOME_QUESTION_PROMPTS.map((question) => (
            <QuestionButton key={question} question={question} />
          ))}
        </div>
      </div>
      <ResearchMockup />
    </Section>
  );
}
