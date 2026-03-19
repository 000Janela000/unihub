'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';
import { useLanguage } from '@/i18n';

export function ScheduleCard() {
  const { weekSchedule, loading } = useSchedule();
  const { t } = useLanguage();

  // Get today's day of week (1=Mon..5=Fri, 0 or 6 = weekend)
  const jsDay = new Date().getDay();
  const todayDow = jsDay === 0 ? 7 : jsDay; // Convert Sunday=0 to 7

  const todaySchedule = weekSchedule.find((d) => d.dayOfWeek === todayDow);
  const todayLectures = todaySchedule?.lectures || [];

  return (
    <Card className="border border-border shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-semibold">
            <Calendar className="h-5 w-5 text-primary" />
            {t('dashboard.todaySchedule')}
          </span>
          {todayLectures.length > 0 && (
            <Link href="/schedule" className="text-xs text-primary hover:underline">
              {t('schedule.title')}
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <Skeleton className="h-4 w-20" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : todayLectures.length > 0 ? (
          <div className="space-y-3">
            {todayLectures.map((lecture) => (
              <div
                key={lecture.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-medium">{lecture.startTime} - {lecture.endTime}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{lecture.subject}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{lecture.lecturer}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {lecture.room}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="mb-2 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t('dashboard.noClassesToday')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
