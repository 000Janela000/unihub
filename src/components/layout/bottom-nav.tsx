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

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 backdrop-blur-xl bg-background/80 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-all duration-200 active:scale-95',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5 transition-all duration-200', isActive && 'scale-110')} />
              <span className={cn('transition-all duration-200', isActive && 'font-medium')}>{t(item.labelKey)}</span>
              {isActive && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
