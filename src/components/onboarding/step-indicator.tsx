"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ["ფაკულტეტი", "კურსი & ჯგუფი"];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-xs mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all duration-300",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                      ? "border-2 border-primary bg-primary/10 text-primary"
                      : "border-2 border-border bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-foreground" : isCompleted ? "text-primary" : "text-muted-foreground"
                )}
              >
                {STEP_LABELS[i]}
              </span>
            </div>

            {step < totalSteps && (
              <div className="flex-1 mx-3 min-w-3">
                <div
                  className={cn(
                    "h-px w-full transition-all duration-300",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
