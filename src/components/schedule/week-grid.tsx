'use client';

import { useState } from 'react';
import type { WeekSchedule, Lecture } from '@/types';
import { DayColumn } from '@/components/schedule/day-column';
import { useLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

interface WeekGridProps {
  schedule: WeekSchedule;
  onLectureClick: (lecture: Lecture) => void;
}

export function WeekGrid({ schedule, onLectureClick }: WeekGridProps) {
  const { lang } = useLanguage();
  // Default to today's day (Mon=0 ... Fri=4), fallback to 0
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
    if (today >= 1 && today <= 5) return today - 1;
    return 0;
  });

  return (
    <>
      {/* Mobile: single day view with day tabs */}
      <div className="flex flex-col md:hidden">
        {/* Day tabs - pill style */}
        <div className="flex gap-1 overflow-x-auto px-1 pb-3 pt-1">
          {schedule.map((day, index) => {
            const dayName = lang === 'ka' ? day.dayNameKa : day.dayNameEn;
            const shortName = dayName.slice(0, 3);
            const lectureCount = day.lectures.length;
            return (
              <button
                key={day.dayOfWeek}
                type="button"
                onClick={() => setActiveDay(index)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 min-h-[44px] min-w-[56px]',
                  activeDay === index
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <span>{shortName}</span>
                {lectureCount > 0 && (
                  <span className={cn(
                    'mt-0.5 text-[10px]',
                    activeDay === index ? 'text-primary-foreground/70' : 'text-muted-foreground/50'
                  )}>
                    {lectureCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active day column */}
        <div className="px-1">
          {schedule[activeDay] && (
            <DayColumn
              day={schedule[activeDay]}
              onLectureClick={onLectureClick}
              hideHeader
            />
          )}
        </div>
      </div>

      {/* Desktop: all days side by side as card columns */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-4">
        {schedule.map((day) => (
          <DayColumn
            key={day.dayOfWeek}
            day={day}
            onLectureClick={onLectureClick}
          />
        ))}
      </div>
    </>
  );
}
