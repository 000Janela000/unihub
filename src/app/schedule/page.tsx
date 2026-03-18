'use client';

import { CalendarDays } from 'lucide-react';
import { useLanguage } from '@/i18n';

// Next.js App Router requires a default export for pages
export default function SchedulePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <CalendarDays className="mb-6 h-20 w-20 text-muted-foreground/40" />

      <h2 className="mb-2 text-lg font-semibold text-foreground">
        {t('schedule.comingSoon')}
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        {t('schedule.comingSoonDesc')}
      </p>

      <div className="h-px w-16 bg-border" />

      <h2 className="mb-2 mt-4 text-lg font-semibold text-foreground">
        Coming Soon
      </h2>
      <p className="text-sm text-muted-foreground">
        Upload your schedule in Settings
      </p>
    </div>
  );
}
