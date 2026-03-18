'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { useSchedule } from '@/hooks/use-schedule';
import { WeekNav } from '@/components/schedule/week-nav';
import { WeekGrid } from '@/components/schedule/week-grid';
import type { Lecture } from '@/types';

// Next.js App Router requires a default export for pages
export default function SchedulePage() {
  const { t, lang } = useLanguage();
  const { lectures, loading, weekSchedule } = useSchedule();
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const handlePrevWeek = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  const handleLectureClick = useCallback(
    (lecture: Lecture) => {
      const details = [
        lecture.subject,
        '',
        lecture.lecturer
          ? `${lang === 'ka' ? 'ლექტორი' : 'Lecturer'}: ${lecture.lecturer}`
          : '',
        lecture.room
          ? `${lang === 'ka' ? 'ოთახი' : 'Room'}: ${lecture.room}`
          : '',
        `${lecture.startTime} - ${lecture.endTime}`,
        lecture.group
          ? `${lang === 'ka' ? 'ჯგუფი' : 'Group'}: ${lecture.group}`
          : '',
      ]
        .filter(Boolean)
        .join('\n');

      alert(details);
    },
    [lang]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  // No lectures uploaded yet
  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <Upload className="mb-6 h-20 w-20 text-muted-foreground/40" />

        <h2 className="mb-2 text-lg font-semibold text-foreground">
          {t('schedule.uploadPrompt')}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          {t('schedule.comingSoonDesc')}
        </p>

        <Link
          href="/settings"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('schedule.uploadButton')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex h-full flex-col px-2 pb-2 w-full">
      <WeekNav
        currentDate={currentDate}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
      />
      <div className="flex-1 overflow-hidden">
        <WeekGrid schedule={weekSchedule} onLectureClick={handleLectureClick} />
      </div>
    </div>
  );
}
