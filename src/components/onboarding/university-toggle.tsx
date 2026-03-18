'use client';

import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniversityToggleProps {
  value: 'agruni' | 'freeuni' | null;
  onChange: (v: 'agruni' | 'freeuni') => void;
}

const universities = [
  { id: 'agruni' as const, label: 'აგრარული' },
  { id: 'freeuni' as const, label: 'ფრი უნივერსიტეტი' },
];

export function UniversityToggle({ value, onChange }: UniversityToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {universities.map((uni) => {
        const isSelected = value === uni.id;

        return (
          <button
            key={uni.id}
            type="button"
            onClick={() => onChange(uni.id)}
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-lg border-2 p-6 transition-all duration-200',
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-muted-foreground/50'
            )}
          >
            <GraduationCap
              className={cn(
                'h-10 w-10 transition-colors',
                isSelected ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-center text-sm font-medium',
                isSelected ? 'text-primary' : 'text-foreground'
              )}
            >
              {uni.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
