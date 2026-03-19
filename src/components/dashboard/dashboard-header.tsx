'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n';
import { Sun, Moon } from 'lucide-react';

function formatGeorgianDate(): string {
  const date = new Date();
  const months = [
    'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
    'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
  ];
  const days = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const month = months[date.getMonth()];

  return `${dayName}, ${dayNum} ${month}`;
}

function formatEnglishDate(): string {
  const date = new Date();
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

export function DashboardHeader() {
  const { data: session } = useSession();
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <header className="flex items-center justify-between pb-6 h-[72px]" />;
  }

  const userName = session?.user?.name?.split(' ')[0] || '';
  const initials = userName ? userName.slice(0, 2) : 'U';
  const dateStr = lang === 'ka' ? formatGeorgianDate() : formatEnglishDate();

  return (
    <header className="flex items-center justify-between pb-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src={session?.user?.image || undefined} alt={userName} referrerPolicy="no-referrer" />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">
            {t('dashboard.greeting')}, {userName}!
          </h1>
          <p className="text-sm text-muted-foreground">{dateStr}</p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
