/**
 * Push Notification utilities for ONLYMAN PWA.
 * 
 * Usage:
 *   import { requestNotificationPermission, subscribeToPush } from './lib/pushNotifications';
 *   
 *   // Request permission
 *   const granted = await requestNotificationPermission();
 *   
 *   // Subscribe (needs VAPID public key from backend)
 *   const subscription = await subscribeToPush(vapidPublicKey);
 *   // Send subscription to your Supabase backend
 */

/**
 * Check if push notifications are supported
 */
export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Request notification permission from the user
 * @returns {Promise<boolean>} true if granted
 */
export async function requestNotificationPermission() {
  if (!isPushSupported()) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Get current notification permission state
 * @returns {'granted' | 'denied' | 'default'}
 */
export function getNotificationPermission() {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Subscribe to push notifications through the service worker.
 * Requires a VAPID public key from the backend.
 * 
 * @param {string} vapidPublicKey - The VAPID public key (base64 URL-encoded)
 * @returns {Promise<PushSubscription|null>}
 */
export async function subscribeToPush(vapidPublicKey) {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    const existing = await registration.pushManager.getSubscription();
    if (existing) return existing;

    // Convert VAPID key
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush() {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Push unsubscribe failed:', error);
    return false;
  }
}

/**
 * Show a local notification (for testing / non-push usage)
 */
export async function showLocalNotification(title, body, options = {}) {
  if (!isPushSupported()) return;
  if (Notification.permission !== 'granted') return;

  const registration = await navigator.serviceWorker.ready;
  registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    tag: 'local',
    ...options,
  });
}

// Helper: Convert VAPID key from base64 URL to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
