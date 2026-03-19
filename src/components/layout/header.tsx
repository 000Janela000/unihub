'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/i18n';

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

  const titleKey = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1];

  const avatar = mounted && session?.user?.image ? (
    <Link
      href="/profile"
      className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-primary/30"
    >
      <img
        src={session.user.image}
        alt=""
        className="h-8 w-8 rounded-full"
        referrerPolicy="no-referrer"
      />
    </Link>
  ) : (
    <div className="h-8 w-8 rounded-full bg-muted" />
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border/50 backdrop-blur-xl bg-background/80 px-4 sm:px-6 md:left-60 md:px-6">
      <Link href="/exams" className="text-lg font-semibold text-foreground md:hidden">
        UniHub
      </Link>
      {/* Desktop: show current page title */}
      <h1 className="hidden md:block text-sm font-medium text-muted-foreground">
        {titleKey ? t(titleKey) : ''}
      </h1>
      {/* Mobile: avatar */}
      <div className="md:hidden">
        {avatar}
      </div>
      {/* Desktop: avatar */}
      <div className="hidden md:block">
        {avatar}
      </div>
    </header>
  );
}
