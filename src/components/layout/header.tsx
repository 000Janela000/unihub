'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
      <Link href="/exams" className="text-lg font-bold text-foreground">
        UniSchedule
      </Link>
      <Link
        href="/settings"
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </header>
  );
}
