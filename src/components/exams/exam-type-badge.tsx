'use client';

import { ExamType } from '@/types';
import { useLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

interface ExamTypeBadgeProps {
  type: ExamType;
  label?: string;
}

const typeStyles: Record<ExamType, string> = {
  [ExamType.Midterm]: 'bg-exam-midterm/15 text-exam-midterm',
  [ExamType.Final]: 'bg-exam-final/15 text-exam-final',
  [ExamType.Quiz]: 'bg-exam-quiz/15 text-exam-quiz',
  [ExamType.Retake]: 'bg-muted text-muted-foreground',
  [ExamType.Additional]: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  [ExamType.Unknown]: 'bg-muted text-muted-foreground',
};

export function ExamTypeBadge({ type, label }: ExamTypeBadgeProps) {
  const { t } = useLanguage();

  const displayLabel = label || t(`examTypes.${type}`) || type;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
        typeStyles[type]
      )}
    >
      {displayLabel}
    </span>
  );
}
