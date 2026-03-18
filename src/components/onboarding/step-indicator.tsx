'use client';

import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div
            key={step}
            className={cn(
              'rounded-full transition-all duration-500 ease-out',
              isActive
                ? 'h-2.5 w-8 bg-primary'
                : isCompleted
                  ? 'h-2.5 w-2.5 bg-primary/60'
                  : 'h-2.5 w-2.5 bg-muted-foreground/20'
            )}
          />
        );
      })}
    </div>
  );
}
