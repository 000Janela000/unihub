'use client';

import {
  Wheat,
  FlaskConical,
  Dna,
  Utensils,
  Grape,
  Stethoscope,
  TreePine,
  Mountain,
  Cpu,
  HardHat,
  Cog,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { AGRUNI_FACULTIES, FIRST_YEAR_FACULTY } from '@/lib/group-decoder';
import { cn } from '@/lib/utils';

interface FacultyGridProps {
  university: 'agruni' | 'freeuni';
  value: string | null;
  onChange: (facultyId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  wheat: Wheat,
  'flask-conical': FlaskConical,
  dna: Dna,
  utensils: Utensils,
  grape: Grape,
  stethoscope: Stethoscope,
  'tree-pine': TreePine,
  mountain: Mountain,
  cpu: Cpu,
  'hard-hat': HardHat,
  cog: Cog,
  'graduation-cap': GraduationCap,
};

export function FacultyGrid({ university, value, onChange }: FacultyGridProps) {
  // For now, only agruni has defined faculties
  const faculties = university === 'agruni' ? AGRUNI_FACULTIES : [];

  return (
    <div className="space-y-4">
      {/* First Year Card */}
      <button
        type="button"
        onClick={() => onChange(FIRST_YEAR_FACULTY.id)}
        className={cn(
          'flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all duration-200',
          value === FIRST_YEAR_FACULTY.id
            ? 'border-primary bg-primary/10'
            : 'border-border bg-card hover:border-muted-foreground/50'
        )}
      >
        <GraduationCap
          className={cn(
            'h-8 w-8 flex-shrink-0',
            value === FIRST_YEAR_FACULTY.id ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <div className="text-left">
          <div
            className={cn(
              'font-medium',
              value === FIRST_YEAR_FACULTY.id ? 'text-primary' : 'text-foreground'
            )}
          >
            {FIRST_YEAR_FACULTY.nameKa}
          </div>
          <div className="text-xs text-muted-foreground">
            {FIRST_YEAR_FACULTY.nameEn}
          </div>
        </div>
      </button>

      {/* Faculty Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {faculties.map((faculty) => {
          const isSelected = value === faculty.id;
          const Icon = iconMap[faculty.icon] || GraduationCap;

          return (
            <button
              key={faculty.id}
              type="button"
              onClick={() => onChange(faculty.id)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-muted-foreground/50'
              )}
            >
              <Icon
                className={cn(
                  'h-7 w-7',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <div className="text-center">
                <div
                  className={cn(
                    'text-xs font-medium leading-tight',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {faculty.nameKa}
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">
                  {faculty.nameEn}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
