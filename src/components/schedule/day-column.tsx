'use client';

import type { DaySchedule, Lecture } from '@/types';
import { useLanguage } from '@/i18n';
import { LectureBlock } from '@/components/schedule/lecture-block';

interface DayColumnProps {
  day: DaySchedule;
  onLectureClick: (lecture: Lecture) => void;
  startHour: number;
  endHour: number;
}

export function DayColumn({ day, onLectureClick, startHour, endHour }: DayColumnProps) {
  const { lang } = useLanguage();
  const dayName = lang === 'ka' ? day.dayNameKa : day.dayNameEn;
  const shortDayName = lang === 'ka' ? dayName.slice(0, 3) : dayName.slice(0, 3);
  const totalHours = endHour - startHour;

  return (
    <div className="flex min-w-[120px] flex-1 flex-col">
      {/* Day header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card px-2 py-2 text-center">
        <span className="text-xs font-semibold text-foreground">{shortDayName}</span>
      </div>

      {/* Time grid area */}
      <div className="relative flex-1" style={{ minHeight: `${totalHours * 60}px` }}>
        {/* Background grid lines */}
        {Array.from({ length: totalHours }, (_, i) => (
          <div
            key={i}
            className="absolute inset-x-0 border-t border-border/40"
            style={{ top: `${(i / totalHours) * 100}%` }}
          />
        ))}

        {/* Lecture blocks */}
        {day.lectures.map((lecture) => (
          <LectureBlock
            key={lecture.id}
            lecture={lecture}
            onClick={onLectureClick}
            startHour={startHour}
            endHour={endHour}
          />
        ))}
      </div>
    </div>
  );
}
