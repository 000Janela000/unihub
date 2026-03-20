'use client';

import { cn } from '@/lib/utils';
import { getAcademicYear } from '@/lib/group-decoder';

interface YearPickerProps {
  value: number | null;
  onChange: (year: number) => void;
  mode?: 'entryYear' | 'courseYear';
}

export function YearPicker({ value, onChange, mode = 'entryYear' }: YearPickerProps) {
  const academicYear = getAcademicYear();

  // Show entry years from current academic year back 6 years
  const entryYears: { value: number; label: string }[] = [];
  for (let y = academicYear; y >= academicYear - 6; y--) {
    entryYears.push({ value: y, label: String(y) });
  }

  return (
    <div className="space-y-2">
      <p className="text-center text-sm text-muted-foreground">
        რომელ წელს ჩაირიცხეთ?
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {entryYears.map((year) => {
          const isSelected = value === year.value;

          return (
            <button
              key={year.value}
              type="button"
              onClick={() => onChange(year.value)}
              className={cn(
                'flex h-16 w-20 items-center justify-center rounded-xl border-2 text-lg font-bold transition-all duration-200 min-h-[44px]',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'border-border/50 bg-card text-foreground hover:border-muted-foreground/30 hover:shadow-sm'
              )}
            >
              {year.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
