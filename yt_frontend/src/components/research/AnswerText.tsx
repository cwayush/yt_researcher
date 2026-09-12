import { Fragment } from "react";

// The model writes answers in light markdown. Only the emphasis it actually
// uses is rendered; everything else stays literal text.
const BOLD = /\*\*(.+?)\*\*/g;

function renderInline(text: string) {
  const parts = text.split(BOLD);

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

export function AnswerText({ answer }: { answer: string }) {
  const paragraphs = answer.split(/\n{2,}/).filter((block) => block.trim());

  return (
    <div className="text-foreground mb-6 flex flex-col gap-4 text-sm leading-relaxed">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="whitespace-pre-line">
          {renderInline(paragraph)}
        </p>
      ))}
    </div>
  );
}
