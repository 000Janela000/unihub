'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getItem, STORAGE_KEYS } from '@/lib/storage';
import type { UserGroup } from '@/types';

// Next.js App Router requires a default export for pages
export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const group = getItem<UserGroup | null>(STORAGE_KEYS.USER_GROUP, null);

    if (group) {
      router.replace('/exams');
    } else {
      router.replace('/onboarding');
    }

    setLoading(false);
  }, [router]);

  if (!loading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">UniSchedule</span>
      </div>
    </div>
  );
}
