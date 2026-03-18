'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n';

export default function AdminPage() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'connected' | 'not_connected'>('loading');

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((session) => {
        setStatus(session?.user ? 'connected' : 'not_connected');
      })
      .catch(() => {
        setStatus('not_connected');
      });
  }, []);

  return (
    <div className="space-y-6 px-4 py-4">
      <h1 className="text-lg font-bold text-foreground">{t('admin.title')}</h1>

      <section className="rounded-lg border border-border bg-card p-4">
        <p className="mb-4 text-xs text-muted-foreground">
          {t('admin.instructions')}
        </p>

        <div className="mb-4 flex items-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              status === 'connected'
                ? 'bg-green-500'
                : status === 'not_connected'
                  ? 'bg-red-500'
                  : 'bg-yellow-500 animate-pulse'
            }`}
          />
          <span className="text-sm text-card-foreground">
            {status === 'loading'
              ? '...'
              : status === 'connected'
                ? t('admin.connected')
                : t('admin.notConnected')}
          </span>
        </div>

        <a
          href="/api/auth/signin"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('admin.connectGoogle')}
        </a>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          This page is for the app admin only.
        </p>
      </section>
    </div>
  );
}
