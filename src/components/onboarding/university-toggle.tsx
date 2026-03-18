'use client';

import { GraduationCap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniversityToggleProps {
  value: 'agruni' | 'freeuni' | null;
  onChange: (v: 'agruni' | 'freeuni') => void;
}

const universities = [
  { id: 'agruni' as const, label: 'აგრარული', desc: 'Agricultural University of Georgia' },
  { id: 'freeuni' as const, label: 'ფრი უნივერსიტეტი', desc: 'Free University of Tbilisi' },
];

export function UniversityToggle({ value, onChange }: UniversityToggleProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {universities.map((uni) => {
        const isSelected = value === uni.id;

        return (
          <button
            key={uni.id}
            type="button"
            onClick={() => onChange(uni.id)}
            className={cn(
              'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-8 transition-all duration-200 min-h-[140px]',
              isSelected
                ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                : 'border-border/50 bg-card hover:border-muted-foreground/30 hover:shadow-sm'
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
            <GraduationCap
              className={cn(
                'h-10 w-10 transition-colors duration-200',
                isSelected ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <div className="text-center">
              <span
                className={cn(
                  'block text-sm font-semibold transition-colors duration-200',
                  isSelected ? 'text-primary' : 'text-foreground'
                )}
              >
                {uni.label}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{uni.desc}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
