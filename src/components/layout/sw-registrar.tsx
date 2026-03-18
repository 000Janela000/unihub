'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/notifications';

/**
 * Client component that registers the service worker on mount.
 * Renders nothing visible.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
