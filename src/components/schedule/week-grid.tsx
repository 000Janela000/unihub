'use client';

import type { WeekSchedule, Lecture } from '@/types';
import { DayColumn } from '@/components/schedule/day-column';

interface WeekGridProps {
  schedule: WeekSchedule;
  onLectureClick: (lecture: Lecture) => void;
}

const START_HOUR = 8;
const END_HOUR = 20;

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function WeekGrid({ schedule, onLectureClick }: WeekGridProps) {
  const totalHours = END_HOUR - START_HOUR;

  return (
    <div className="flex flex-1 overflow-x-auto rounded-lg border border-border bg-card">
      {/* Time axis */}
      <div className="sticky left-0 z-20 flex flex-shrink-0 flex-col border-r border-border bg-card">
        {/* Empty header aligned with day headers */}
        <div className="border-b border-border px-2 py-2">
          <span className="text-[10px] text-transparent">00:00</span>
        </div>

        {/* Time labels */}
        <div className="relative flex-1" style={{ minHeight: `${totalHours * 60}px` }}>
          {Array.from({ length: totalHours }, (_, i) => (
            <div
              key={i}
              className="absolute right-0 left-0 px-1.5"
              style={{ top: `${(i / totalHours) * 100}%`, transform: 'translateY(-6px)' }}
            >
              <span className="text-[10px] text-muted-foreground">
                {formatHour(START_HOUR + i)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Day columns */}
      {schedule.map((day) => (
        <DayColumn
          key={day.dayOfWeek}
          day={day}
          onLectureClick={onLectureClick}
          startHour={START_HOUR}
          endHour={END_HOUR}
        />
      ))}
    </div>
  );
}
