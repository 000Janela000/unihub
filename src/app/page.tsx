'use client';

import { useAuthGuard } from '@/hooks/use-auth-guard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ScheduleCard } from '@/components/dashboard/schedule-card';
import { ExamsCard } from '@/components/dashboard/exams-card';
import { GPACard } from '@/components/dashboard/gpa-card';
import { QuickLinksCard } from '@/components/dashboard/quick-links-card';
import { ConspectsCard } from '@/components/dashboard/conspects-card';

export default function DashboardPage() {
  const { ready, loading } = useAuthGuard();

  if (loading || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-scale-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg shadow-primary/20">
            U
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-base font-semibold text-foreground">UniHub</span>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
        <DashboardHeader />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <ScheduleCard />
            <GPACard />
            <QuickLinksCard />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <ExamsCard />
            <ConspectsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
