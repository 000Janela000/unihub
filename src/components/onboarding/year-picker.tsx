'use client';

import { cn } from '@/lib/utils';

interface YearPickerProps {
  value: number | null;
  onChange: (year: number) => void;
  showMasters?: boolean;
}

const years = [
  { value: 1, label: 'I' },
  { value: 2, label: 'II' },
  { value: 3, label: 'III' },
  { value: 4, label: 'IV' },
];

export function YearPicker({ value, onChange, showMasters }: YearPickerProps) {
  const allYears = showMasters
    ? [...years, { value: 5, label: 'MAG' }]
    : years;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {allYears.map((year) => {
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
  );
}
