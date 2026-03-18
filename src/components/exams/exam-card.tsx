'use client';

import { useState } from 'react';
import { ChevronDown, Clock, Users } from 'lucide-react';
import type { Exam } from '@/types';
import { ExamType } from '@/types';
import { ExamTypeBadge } from '@/components/exams/exam-type-badge';
import { CountdownTimer } from '@/components/exams/countdown-timer';
import { cn } from '@/lib/utils';

interface ExamCardProps {
  exam: Exam;
  lang: 'ka' | 'en';
}

const borderColorMap: Record<ExamType, string> = {
  [ExamType.Midterm]: 'border-l-exam-midterm',
  [ExamType.Final]: 'border-l-exam-final',
  [ExamType.Quiz]: 'border-l-exam-quiz',
  [ExamType.Retake]: 'border-l-muted-foreground',
  [ExamType.Additional]: 'border-l-amber-500',
  [ExamType.Unknown]: 'border-l-muted-foreground',
};

export function ExamCard({ exam, lang }: ExamCardProps) {
  const [expanded, setExpanded] = useState(false);

  const targetDate = new Date(`${exam.date}T${exam.startTime}:00`);

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card border-l-4 transition-shadow hover:shadow-sm',
        borderColorMap[exam.examType]
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        {/* Time column */}
        <div className="flex flex-shrink-0 flex-col items-center gap-0.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">{exam.startTime}</span>
          {exam.endTime && (
            <span className="text-[10px] text-muted-foreground">{exam.endTime}</span>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium leading-tight text-card-foreground">
              {exam.subjectClean}
            </h3>
            <ChevronDown
              className={cn(
                'h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200',
                expanded && 'rotate-180'
              )}
            />
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <ExamTypeBadge type={exam.examType} label={exam.examTypeLabel} />
            <CountdownTimer targetDate={targetDate} lang={lang} />
          </div>
        </div>
      </button>

      {/* Expandable content using CSS grid trick */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-4 pb-4 pt-3">
            {/* Full subject name */}
            {exam.subject !== exam.subjectClean && (
              <p className="mb-2 text-xs text-muted-foreground">{exam.subject}</p>
            )}

            {/* Lecturers */}
            {exam.lecturers.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {lang === 'ka' ? 'ლექტორები' : 'Lecturers'}:{' '}
                </span>
                <span className="text-xs text-card-foreground">
                  {exam.lecturers.join(', ')}
                </span>
              </div>
            )}

            {/* Groups */}
            {exam.groups.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {lang === 'ka' ? 'ჯგუფები' : 'Groups'}:{' '}
                </span>
                <span className="font-mono text-xs text-card-foreground">
                  {exam.groups.join(', ')}
                </span>
              </div>
            )}

            {/* Student count */}
            {exam.studentCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>
                  {exam.studentCount} {lang === 'ka' ? 'სტუდენტი' : 'students'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
