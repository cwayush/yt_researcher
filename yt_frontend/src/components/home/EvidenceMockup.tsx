import { Play } from "lucide-react";
import { demoQAPairs } from "@/data/demo";
import { firstParagraph } from "@/lib/utils";

const [{ question, answer, evidence }] = demoQAPairs;
const [chunk] = evidence;

export function EvidenceMockup() {
  return (
    <div className="rounded-panel border-cream/12 bg-cream/6 border p-6">
      <p className="text-cream/40 mb-2 text-xs font-semibold tracking-widest uppercase">Question</p>
      <p className="text-cream/90 mb-4 text-sm font-medium">{question}</p>

      <p className="text-cream/40 mb-2 text-xs font-semibold tracking-widest uppercase">Answer</p>
      <p className="text-cream/75 mb-5 text-sm leading-relaxed">{firstParagraph(answer)}</p>

      <div className="rounded-card border-cream/12 bg-cream/6 border p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-cream/40 text-xs font-semibold tracking-widest uppercase">
            Evidence 01
          </p>
          <span className="font-mono-ts text-gold/90 text-xs">
            {chunk.startTimestamp}&ndash;{chunk.endTimestamp}
          </span>
        </div>
        <p className="border-cream/15 text-cream/60 mb-3 border-l-2 pl-2.5 text-xs leading-relaxed italic">
          &ldquo;{chunk.text}&rdquo;
        </p>
        <span className="text-gold flex items-center gap-1.5 text-xs font-medium">
          <span className="bg-gold/15 flex h-5 w-5 items-center justify-center rounded-full">
            <Play className="h-2.5 w-2.5 fill-current" />
          </span>
          Jump to source
        </span>
      </div>
    </div>
  );
}
