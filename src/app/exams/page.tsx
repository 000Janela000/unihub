'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, AlertCircle, ClipboardList, Download, BookOpen } from 'lucide-react';
import { useExams } from '@/hooks/use-exams';
import { useUserGroup } from '@/hooks/use-user-group';
import { useLanguage } from '@/i18n';
import { ExamDayGroup } from '@/components/exams/exam-day-group';
import { generateBulkICS, downloadICS } from '@/lib/calendar-export';
import { cn } from '@/lib/utils';
import type { Exam } from '@/types';

const SUBJECTS_STORAGE_KEY = 'unischedule_subjects';

function ExamSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 w-32 rounded-lg bg-muted" />
      <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="space-y-2">
            <div className="h-3 w-8 rounded-lg bg-muted" />
            <div className="h-3 w-10 rounded-lg bg-muted" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded-lg bg-muted" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function groupExamsByDate(exams: Exam[]): Map<string, Exam[]> {
  const groups = new Map<string, Exam[]>();
  for (const exam of exams) {
    const existing = groups.get(exam.date);
    if (existing) {
      existing.push(exam);
    } else {
      groups.set(exam.date, [exam]);
    }
  }
  return groups;
}

// Next.js App Router requires a default export for pages
export default function ExamsPage() {
  const { group, loading: groupLoading } = useUserGroup();
  const { lang, t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [exported, setExported] = useState(false);

  const [selectedSubjects, setSelectedSubjects] = useState<string[] | null>(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SUBJECTS_STORAGE_KEY);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSelectedSubjects(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const { exams, loading, error, refetch } = useExams(
    group?.groupCode || null,
    group?.university || 'agruni',
    selectedSubjects
  );

  const examsByDate = useMemo(() => groupExamsByDate(exams), [exams]);
  const sortedDates = useMemo(
    () => Array.from(examsByDate.keys()).sort(),
    [examsByDate]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 600);
  }, [refetch]);

  const handleExportAll = useCallback(() => {
    if (exams.length === 0) return;
    const ics = generateBulkICS(exams);
    downloadICS(ics, 'unischedule-exams.ics');
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, [exams]);

  if (groupLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">{t('exams.title')}</h1>
        </div>
        <ExamSkeleton />
        <ExamSkeleton />
        <ExamSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center animate-fade-in">
        <div className="rounded-xl border border-border/50 bg-card p-8 shadow-sm max-w-sm w-full">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive/80" />
          <h2 className="mb-2 text-lg font-semibold text-foreground">{t('exams.error')}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] min-h-[44px]"
          >
            {t('exams.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center animate-fade-in">
        <ClipboardList className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h2 className="mb-2 text-lg font-semibold text-foreground">{t('exams.noExams')}</h2>
        <p className="mb-6 text-sm text-muted-foreground max-w-xs">{t('exams.noExamsDesc')}</p>
        <button
          type="button"
          onClick={refetch}
          className="rounded-xl border border-border/50 bg-card px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted active:scale-[0.98] min-h-[44px] shadow-sm"
        >
          {t('exams.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <h1 className="text-lg font-semibold text-foreground">{t('exams.title')}</h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleExportAll}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-medium transition-all duration-200 min-h-[36px]',
              exported
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent active:scale-95'
            )}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">
              {exported
                ? lang === 'ka' ? 'ექსპორტირებულია!' : 'Exported!'
                : lang === 'ka' ? 'ყველას ექსპორტი' : 'Export All'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent disabled:opacity-50"
          >
            <RefreshCw
              className={cn(
                'h-4 w-4 transition-transform',
                refreshing && 'animate-spin'
              )}
            />
          </button>
        </div>
      </div>

      {/* Group info + subject filter indicator */}
      <div className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
        {group && (
          <div className="rounded-full bg-muted/60 px-3 py-1.5">
            <span className="font-mono text-xs font-medium text-primary">
              {group.groupCode}
            </span>
          </div>
        )}
        {selectedSubjects && (
          <Link
            href="/subjects"
            className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t('subjects.nSubjects').replace('{n}', String(selectedSubjects.length))}
          </Link>
        )}
      </div>

      {/* Exam day groups with staggered fade-in */}
      {sortedDates.map((date, index) => (
        <div
          key={date}
          className="animate-slide-up"
          style={{ animationDelay: `${(index + 1) * 80}ms` }}
        >
          <ExamDayGroup
            date={date}
            exams={examsByDate.get(date)!}
            lang={lang}
          />
        </div>
      ))}
    </div>
  );
}
