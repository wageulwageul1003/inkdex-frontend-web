import { getMessaging, getToken, isSupported } from 'firebase/messaging';

import { firebaseApp } from './firebase';

export async function getFcmToken() {
  if (!(await isSupported())) {
    return null;
  }

  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return null;
    }
  }

  const registration = await navigator.serviceWorker.ready;

  const messaging = getMessaging(firebaseApp);

  return getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    serviceWorkerRegistration: registration,
  });
}
