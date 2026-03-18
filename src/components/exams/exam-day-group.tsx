'use client';

import type { Exam } from '@/types';
import { ExamCard } from '@/components/exams/exam-card';
import { formatGeorgianDate, GEORGIAN_DAYS } from '@/lib/georgian-dates';

interface ExamDayGroupProps {
  date: string;
  exams: Exam[];
  lang: 'ka' | 'en';
}

function formatDateHeader(isoDate: string, lang: 'ka' | 'en'): string {
  const date = new Date(isoDate + 'T00:00:00');

  if (lang === 'ka') {
    // getDay() returns 0=Sunday, 1=Monday... need to map to GEORGIAN_DAYS (0=Monday)
    const jsDay = date.getDay();
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const dayName = GEORGIAN_DAYS[dayIndex] || '';
    return `${formatGeorgianDate(date)} - ${dayName}`;
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ExamDayGroup({ date, exams, lang }: ExamDayGroupProps) {
  const headerText = formatDateHeader(date, lang);

  return (
    <div className="space-y-3">
      <div className="sticky top-14 z-10 bg-background/95 py-2 backdrop-blur-sm">
        <h2 className="text-sm font-semibold text-foreground">{headerText}</h2>
      </div>

      <div className="space-y-2">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} lang={lang} />
        ))}
      </div>
    </div>
  );
}
