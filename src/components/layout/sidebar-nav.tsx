'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  User,
  Settings,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { href: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/schedule', labelKey: 'nav.schedule', icon: Calendar },
  { href: '/exams', labelKey: 'nav.exams', icon: GraduationCap },
  { href: '/settings', labelKey: 'nav.settings', icon: Settings },
  { href: '/profile', labelKey: 'profile.title', icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on login and onboarding pages
  if (pathname === '/login' || pathname.startsWith('/onboarding')) {
    return null;
  }

  if (!mounted) {
    return (
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-60 flex-col border-r border-border bg-sidebar" />
    );
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-60 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <img
          src="/icons/icon-512.png"
          alt="UniHub"
          className="h-8 w-8 rounded-lg"
        />
        <Link href="/" className="text-lg font-semibold text-sidebar-foreground">
          UniHub
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with user info */}
      <div className="border-t border-border p-4">
        {session?.user && (
          <Link
            href="/profile"
            className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent"
          >
            {session.user.image ? (
              <img
                src={session.user.image}
                alt=""
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-sidebar-foreground">
                {session.user.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </Link>
        )}
        <p className="px-2 text-center text-xs text-muted-foreground">
          UniHub v1.0
        </p>
      </div>
    </aside>
  );
}
