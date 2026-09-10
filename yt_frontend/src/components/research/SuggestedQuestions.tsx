import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { QuestionButton } from "@/components/research/QuestionButton";

interface SuggestedQuestionsProps {
  questions: readonly string[];
}

export function SuggestedQuestions({ questions }: SuggestedQuestionsProps) {
  return (
    <div className="mb-8">
      <EyebrowLabel className="mb-3">You could ask</EyebrowLabel>
      <div className="flex flex-col gap-1.5">
        {questions.map((question) => (
          <QuestionButton 
          key={question} 
          question={question} 
          hoverTone="surface" 
          className="px-4" />
        ))}
      </div>
    </div>
  );
}
