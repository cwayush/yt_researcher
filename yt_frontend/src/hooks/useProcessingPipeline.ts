import { useEffect, useState } from "react";
import { PROCESSING_COMPLETE_MS, PROCESSING_STEPS, PROCESSING_STEP_MS } from "@/lib/constants";
import { ProcessingStepState } from "@/types";

function statusFor(index: number, completedCount: number): ProcessingStepState["status"] {
  if (index < completedCount) return "completed";
  return index === completedCount ? "active" : "pending";
}

// Drives the ingestion animation one step at a time, then fires onComplete.
export function useProcessingPipeline(onComplete: () => void, enabled = true) {
  const [completedCount, setCompletedCount] = useState(0);
  const isComplete = completedCount >= PROCESSING_STEPS.length;

  useEffect(() => {
    if (!enabled) return;

    const delay = isComplete ? PROCESSING_COMPLETE_MS : PROCESSING_STEP_MS;
    const timer = setTimeout(() => {
      if (isComplete) onComplete();
      else setCompletedCount((count) => count + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [completedCount, enabled, isComplete, onComplete]);

  const steps: ProcessingStepState[] = PROCESSING_STEPS.map((step, i) => ({
    ...step,
    status: statusFor(i, completedCount),
  }));

  return { steps, isComplete };
}
