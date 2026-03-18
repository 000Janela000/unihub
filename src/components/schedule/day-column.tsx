'use client';

import type { DaySchedule, Lecture } from '@/types';
import { useLanguage } from '@/i18n';
import { LectureCard } from '@/components/schedule/lecture-card';
import { CalendarX } from 'lucide-react';

interface DayColumnProps {
  day: DaySchedule;
  onLectureClick: (lecture: Lecture) => void;
  hideHeader?: boolean;
}

export function DayColumn({ day, onLectureClick, hideHeader }: DayColumnProps) {
  const { lang } = useLanguage();
  const dayName = lang === 'ka' ? day.dayNameKa : day.dayNameEn;
  const sorted = [...day.lectures].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Day header */}
      {!hideHeader && (
        <div className="mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {dayName}
          </span>
          <span className="ml-2 text-xs text-muted-foreground/60">
            {sorted.length > 0 ? `${sorted.length}` : ''}
          </span>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CalendarX className="mb-2 h-8 w-8 text-muted-foreground/20" />
          <p className="text-xs text-muted-foreground/50">
            {lang === 'ka' ? 'ლექციები არ არის' : 'No classes'}
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-2 pl-4">
          {/* Timeline line */}
          <div className="absolute left-1 top-3 bottom-3 w-px bg-border" />

          {sorted.map((lecture) => (
            <div key={lecture.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-3 top-4 h-2 w-2 rounded-full bg-primary/60 ring-2 ring-background" />
              <LectureCard lecture={lecture} onClick={onLectureClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
