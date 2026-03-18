'use client';

import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;

        return (
          <div
            key={step}
            className={cn(
              'rounded-full transition-all duration-300',
              isActive
                ? 'h-3 w-3 bg-primary'
                : 'h-2 w-2 bg-muted-foreground/30'
            )}
          />
        );
      })}
    </div>
  );
}
