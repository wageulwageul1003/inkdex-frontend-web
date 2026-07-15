'use client';

import { useEffect } from 'react';

export default function FcmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function registerServiceWorker() {
      if (!('serviceWorker' in navigator)) {
        return;
      }

      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        console.log('Service Worker Registered');
      } catch (error) {
        console.error(error);
      }
    }

    registerServiceWorker();
  }, []);

  return <>{children}</>;
}
