'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserGroup } from '@/hooks/use-user-group';
import { useLanguage } from '@/i18n';
import { AGRUNI_FACULTIES, FIRST_YEAR_FACULTY } from '@/lib/group-decoder';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { group } = useUserGroup();
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (!mounted || status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;

  const faculty = group
    ? group.facultyId === 'first-year'
      ? FIRST_YEAR_FACULTY
      : AGRUNI_FACULTIES.find((f) => f.id === group.facultyId)
    : null;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8 pb-24 lg:pb-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Profile card */}
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex flex-col items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                className="h-20 w-20 rounded-full border-2 border-border/50"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">{session.user.name}</h2>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Group info */}
        {group && (
          <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
            {faculty && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('onboarding.selectFaculty')}</span>
                <span className="font-medium text-foreground">{faculty.nameKa}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('onboarding.yearLabel')}</span>
              <span className="font-medium text-foreground">{group.year}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('onboarding.groupPreview')}</span>
              <span className="font-medium text-foreground">{group.groupCode}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => router.push('/onboarding')}
            className="w-full rounded-xl border border-border/50 bg-card px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent active:scale-[0.98]"
          >
            {t('profile.changeGroup')}
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/20 active:scale-[0.98]"
          >
            {t('profile.signOut')}
          </button>
        </div>
      </div>
    </div>
  );
}
