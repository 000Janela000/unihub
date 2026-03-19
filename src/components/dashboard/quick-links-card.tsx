'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Mail, BookOpen, Globe } from 'lucide-react';
import { useLanguage } from '@/i18n';

export function QuickLinksCard() {
  const { t } = useLanguage();

  const quickLinks = [
    {
      id: 'emis',
      labelKey: 'dashboard.emis',
      href: 'https://emis.campus.edu.ge',
      icon: ExternalLink,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      id: 'email',
      labelKey: 'dashboard.email',
      href: 'https://mail.google.com',
      icon: Mail,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      id: 'library',
      labelKey: 'dashboard.library',
      href: '#',
      icon: BookOpen,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      id: 'website',
      labelKey: 'dashboard.website',
      href: 'https://agruni.edu.ge',
      icon: Globe,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
  ];

  return (
    <Card className="border border-border shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ExternalLink className="h-5 w-5 text-primary" />
          {t('dashboard.quickLinks')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted"
              >
                <div className={`rounded-full p-2.5 ${link.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground">{t(link.labelKey)}</span>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
