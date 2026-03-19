'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExams } from '@/hooks/use-exams';
import { useUserGroup } from '@/hooks/use-user-group';
import { useLanguage } from '@/i18n';
import type { ExamType } from '@/types';

const examTypeBorderColors: Record<string, string> = {
  midterm: 'border-l-amber-500',
  final: 'border-l-red-500',
  quiz: 'border-l-blue-500',
  retake: 'border-l-gray-400',
  additional: 'border-l-green-500',
  unknown: 'border-l-gray-300',
};

const examTypeBadgeVariants: Record<string, string> = {
  midterm: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  final: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  quiz: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  retake: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  additional: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  unknown: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
};

function getCountdownText(dateStr: string): { text: string; urgent: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(dateStr);
  examDate.setHours(0, 0, 0, 0);

  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'დასრულდა', urgent: false };
  if (diffDays === 0) return { text: 'დღეს', urgent: true };
  if (diffDays === 1) return { text: 'ხვალ', urgent: true };
  if (diffDays <= 3) return { text: `${diffDays} დღეში`, urgent: true };
  return { text: `${diffDays} დღეში`, urgent: false };
}

export function ExamsCard() {
  const { group } = useUserGroup();
  const { exams, loading } = useExams(group?.groupCode || null);
  const { t } = useLanguage();

  // Get upcoming exams (future only), limited to 3
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingExams = exams
    .filter((exam) => new Date(exam.date) >= now)
    .slice(0, 3);

  return (
    <Card className="border border-border shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-semibold">
            <GraduationCap className="h-5 w-5 text-primary" />
            {t('dashboard.upcomingExams')}
          </span>
          {upcomingExams.length > 0 && (
            <Link href="/exams" className="text-xs text-primary hover:underline">
              {t('exams.title')}
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : upcomingExams.length > 0 ? (
          <div className="space-y-3">
            {upcomingExams.map((exam) => {
              const countdown = getCountdownText(exam.date);
              const typeKey = exam.examType || 'unknown';
              const typeLabel = t(`examTypes.${typeKey}`) || exam.examTypeLabel;

              // Format date in Georgian
              const examDate = new Date(exam.date);
              const day = examDate.getDate();
              const months = [
                'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
                'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
              ];
              const dateDisplay = `${day} ${months[examDate.getMonth()]}`;

              return (
                <div
                  key={exam.id}
                  className={cn(
                    'rounded-lg border border-border bg-muted/30 p-3 border-l-4',
                    examTypeBorderColors[typeKey] || examTypeBorderColors.unknown
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{exam.subjectClean}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{dateDisplay}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge
                        variant="secondary"
                        className={cn('text-xs', examTypeBadgeVariants[typeKey] || examTypeBadgeVariants.unknown)}
                      >
                        {typeLabel}
                      </Badge>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          countdown.urgent ? 'text-red-500' : 'text-muted-foreground'
                        )}
                      >
                        {countdown.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t('dashboard.noExamsScheduled')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
