'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isPushSupported,
  registerServiceWorker,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/lib/notifications';

export function useNotifications() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<string>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const isSupported = isPushSupported();
    setSupported(isSupported);

    if (!isSupported) return;

    setPermission(Notification.permission);

    // Check for existing service worker and subscription
    navigator.serviceWorker.getRegistration('/sw.js').then((reg) => {
      if (!reg) return;
      setRegistration(reg);

      reg.pushManager.getSubscription().then((sub) => {
        setSubscribed(!!sub);
      });
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!supported) return;

    // Request notification permission
    const perm = await Notification.requestPermission();
    setPermission(perm);

    if (perm !== 'granted') return;

    // Get or register service worker
    let reg = registration;
    if (!reg) {
      reg = await registerServiceWorker();
      if (!reg) return;
      setRegistration(reg);
    }

    // Subscribe to push
    const subscription = await subscribeToPush(reg);
    if (!subscription) return;

    // Send subscription to server
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
    } catch (error) {
      console.warn('Failed to send subscription to server:', error);
    }

    setSubscribed(true);
  }, [supported, registration]);

  const unsubscribe = useCallback(async () => {
    if (!registration) return;

    const success = await unsubscribeFromPush(registration);

    if (success) {
      setSubscribed(false);
    }
  }, [registration]);

  return { supported, permission, subscribed, subscribe, unsubscribe };
}
