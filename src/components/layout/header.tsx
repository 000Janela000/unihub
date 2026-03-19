'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/i18n';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const pageTitles: Record<string, string> = {
  '/exams': 'nav.exams',
  '/schedule': 'nav.schedule',
  '/settings': 'nav.settings',
  '/subjects': 'subjects.title',
  '/profile': 'profile.title',
};

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show header on dashboard home, login, or onboarding
  if (pathname === '/' || pathname === '/login' || pathname.startsWith('/onboarding')) {
    return null;
  }

  const titleKey = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1];

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border backdrop-blur-xl bg-background/80 px-4 sm:px-6 shrink-0">
      {/* Mobile: app name */}
      <Link href="/" className="text-lg font-semibold text-foreground lg:hidden">
        UniHub
      </Link>
      {/* Desktop: current page title */}
      <h1 className="hidden lg:block text-sm font-medium text-muted-foreground">
        {mounted && titleKey ? t(titleKey) : ''}
      </h1>
      {/* Avatar */}
      <div>
        {mounted && session?.user ? (
          <Link href="/profile">
            <Avatar className="h-8 w-8 border border-border transition-all hover:ring-2 hover:ring-primary/30">
              <AvatarImage src={session.user.image || undefined} alt="" referrerPolicy="no-referrer" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {(session.user.name || 'U').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted" />
        )}
      </div>
    </header>
  );
}
