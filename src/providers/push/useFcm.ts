'use client';

import { useCallback, useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);

interface FcmState {
  isSupported: boolean;
  permission: NotificationPermission;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseFcmReturn extends FcmState {
  requestPermission: () => Promise<boolean>;
  registerToken: () => Promise<string | null>;
  removeToken: () => Promise<void>;
}

export function useFcm(): UseFcmReturn {
  const [state, setState] = useState<FcmState>({
    isSupported: false,
    permission: 'default',
    token: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function initialize() {
      const supported = await isSupported();

      setState((prev) => ({
        ...prev,
        isSupported: supported,
        permission: supported ? Notification.permission : 'denied',
        isLoading: false,
      }));

      if (!supported) {
        return;
      }

      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        } catch (error) {
          console.error(error);

          setState((prev) => ({
            ...prev,
            error: 'Service Worker 등록에 실패했습니다.',
          }));
        }
      }
    }

    initialize();
  }, []);

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      return false;
    }

    const permission = await Notification.requestPermission();

    setState((prev) => ({
      ...prev,
      permission,
    }));

    return permission === 'granted';
  }, [state.isSupported]);

  const registerToken = useCallback(async () => {
    if (!state.isSupported) {
      return null;
    }

    let permission = state.permission;

    if (permission !== 'granted') {
      const granted = await requestPermission();

      if (!granted) {
        return null;
      }

      permission = 'granted';
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      const messaging = getMessaging(app);

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        return null;
      }

      setState((prev) => ({
        ...prev,
        token,
        error: null,
      }));

      return token;
    } catch (error) {
      console.error(error);

      setState((prev) => ({
        ...prev,
        error: 'FCM Token 발급에 실패했습니다.',
      }));

      return null;
    }
  }, [requestPermission, state.isSupported, state.permission]);

  const removeToken = useCallback(async () => {
    try {
      const messaging = getMessaging(app);

      await deleteToken(messaging);

      setState((prev) => ({
        ...prev,
        token: null,
      }));
    } catch (error) {
      console.error(error);

      setState((prev) => ({
        ...prev,
        error: 'FCM Token 삭제에 실패했습니다.',
      }));
    }
  }, []);

  return {
    ...state,
    requestPermission,
    registerToken,
    removeToken,
  };
}
