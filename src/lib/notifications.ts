/**
 * Converts a base64-encoded VAPID public key to a Uint8Array
 * for use with PushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Returns true if push notifications are supported in this browser.
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Registers the service worker at /sw.js.
 * Returns the registration, or null if not supported.
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (error) {
    console.warn('Service worker registration failed:', error);
    return null;
  }
}

/**
 * Subscribes to push notifications using the VAPID public key.
 * Returns the subscription, or null if not available.
 */
export async function subscribeToPush(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!vapidKey) {
    console.warn('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set');
    return null;
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
    });

    return subscription;
  } catch (error) {
    console.warn('Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribes from push notifications.
 * Returns true if successful.
 */
export async function unsubscribeFromPush(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  try {
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) return true;

    return await subscription.unsubscribe();
  } catch (error) {
    console.warn('Push unsubscription failed:', error);
    return false;
  }
}
