'use client';

import Link from 'next/link';
import { ChevronRight, Sun, Moon, Monitor, Globe, Github } from 'lucide-react';
import { useUserGroup } from '@/hooks/use-user-group';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

// Next.js App Router requires a default export for pages
export default function SettingsPage() {
  const { group } = useUserGroup();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="space-y-6 px-4 py-4">
      <h1 className="text-lg font-bold text-foreground">{t('settings.title')}</h1>

      {/* My Group */}
      <section className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-sm font-medium text-card-foreground">
              {t('settings.myGroup')}
            </h2>
            {group ? (
              <p className="mt-0.5 font-mono text-xs text-primary">
                {group.groupCode}
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t('settings.noGroup')}
              </p>
            )}
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            {t('settings.change')}
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Language */}
      <section className="rounded-lg border border-border bg-card">
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-card-foreground">
              {t('settings.language')}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLang('ka')}
              className={cn(
                'rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
                lang === 'ka'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-foreground hover:border-muted-foreground/50'
              )}
            >
              ქართული
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={cn(
                'rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
                lang === 'en'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-foreground hover:border-muted-foreground/50'
              )}
            >
              English
            </button>
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="rounded-lg border border-border bg-card">
        <div className="p-4">
          <h2 className="mb-3 text-sm font-medium text-card-foreground">
            {t('settings.theme')}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-2.5 text-xs font-medium transition-all',
                theme === 'light'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-foreground hover:border-muted-foreground/50'
              )}
            >
              <Sun className="h-4 w-4" />
              {t('settings.themeLight')}
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-2.5 text-xs font-medium transition-all',
                theme === 'dark'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-foreground hover:border-muted-foreground/50'
              )}
            >
              <Moon className="h-4 w-4" />
              {t('settings.themeDark')}
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-2.5 text-xs font-medium transition-all',
                theme === 'system'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-foreground hover:border-muted-foreground/50'
              )}
            >
              <Monitor className="h-4 w-4" />
              {t('settings.themeSystem')}
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="rounded-lg border border-border bg-card">
        <div className="p-4">
          <h2 className="mb-3 text-sm font-medium text-card-foreground">
            {t('settings.about')}
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">UniSchedule</span>
              <span className="text-xs text-muted-foreground">
                {t('settings.version')} 1.0.0
              </span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
