'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS_KA = ['ფაკულტეტი', 'წელი & ჯგუფი'];
const STEP_LABELS_EN = ['Faculty', 'Year & Group'];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-xs mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full transition-all duration-300 border-2',
                  isCompleted
                    ? 'h-8 w-8 bg-primary border-primary text-primary-foreground'
                    : isActive
                      ? 'h-9 w-9 bg-background border-primary text-primary'
                      : 'h-8 w-8 bg-background border-muted-foreground/30 text-muted-foreground/50'
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <span className="text-xs font-bold">{step}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  isActive
                    ? 'text-primary'
                    : isCompleted
                      ? 'text-primary/70'
                      : 'text-muted-foreground/50'
                )}
              >
                {STEP_LABELS_KA[i]}
              </span>
            </div>

            {/* Connecting line */}
            {step < totalSteps && (
              <div className="flex-1 mx-2 mb-5">
                <div
                  className={cn(
                    'h-0.5 w-full rounded-full transition-all duration-300',
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
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
