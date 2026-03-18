'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import { useLanguage } from '@/i18n';

const DISMISS_KEY = 'unischedule_install_dismissed';

export function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(DISMISS_KEY) === 'true';
    setDismissed(wasDismissed);
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (!canInstall || dismissed || !isMobile) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  return (
    <div className="fixed top-14 left-0 right-0 z-40 border-b border-border bg-primary/10 px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex-1 text-xs font-medium text-foreground">
          {t('install.prompt')}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={promptInstall}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="h-3 w-3" />
            {t('install.button')}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={t('install.dismiss')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
