'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Calendar, Settings } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  labelKey: string;
  icon: typeof ClipboardList;
}

const navItems: NavItem[] = [
  { href: '/exams', labelKey: 'nav.exams', icon: ClipboardList },
  { href: '/schedule', labelKey: 'nav.schedule', icon: Calendar },
  { href: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-60 flex-col border-r border-border bg-background">
      {/* App logo/title */}
      <div className="flex h-14 items-center border-b border-border px-6">
        <Link href="/exams" className="text-lg font-bold text-foreground">
          UniSchedule
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-primary'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                  <span>{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
