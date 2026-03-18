'use client';

import type { Lecture } from '@/types';
import { cn } from '@/lib/utils';

interface LectureCardProps {
  lecture: Lecture;
  onClick: (lecture: Lecture) => void;
}

const TYPE_COLORS: Record<string, string> = {
  lecture: 'bg-green-500',
  seminar: 'bg-blue-500',
  lab: 'bg-purple-500',
  unknown: 'bg-gray-400',
};

const TYPE_BORDER_COLORS: Record<string, string> = {
  lecture: 'border-l-green-500',
  seminar: 'border-l-blue-500',
  lab: 'border-l-purple-500',
  unknown: 'border-l-gray-400',
};

export function LectureCard({ lecture, onClick }: LectureCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(lecture)}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border border-border/50 bg-card p-3 sm:p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] border-l-[3px]',
        TYPE_BORDER_COLORS[lecture.type] || TYPE_BORDER_COLORS.unknown
      )}
    >
      {/* Time range */}
      <div className="flex flex-col items-center flex-shrink-0">
        <span className="rounded-md bg-muted/60 px-2 py-1 font-mono text-[11px] font-medium text-foreground">
          {lecture.startTime}
        </span>
        <div className="my-0.5 h-2 w-px bg-border" />
        <span className="rounded-md bg-muted/60 px-2 py-1 font-mono text-[11px] font-medium text-muted-foreground">
          {lecture.endTime}
        </span>
      </div>

      {/* Subject info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className={cn('h-2 w-2 rounded-full flex-shrink-0', TYPE_COLORS[lecture.type] || TYPE_COLORS.unknown)} />
          <p className="truncate text-sm font-semibold text-foreground">{lecture.subject}</p>
        </div>
        {lecture.lecturer && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{lecture.lecturer}</p>
        )}
      </div>

      {/* Room badge */}
      {lecture.room && (
        <div className="flex-shrink-0 rounded-lg bg-muted/60 px-2.5 py-1">
          <span className="text-xs font-medium text-muted-foreground">{lecture.room}</span>
        </div>
      )}
    </button>
  );
}
