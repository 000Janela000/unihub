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
              'flex h-14 w-14 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all duration-200',
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:border-muted-foreground/50'
            )}
          >
            {year.label}
          </button>
        );
      })}
    </div>
  );
}
