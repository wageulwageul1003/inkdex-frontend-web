'use client';

import { useCallback, useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
} from 'firebase/messaging';
import { Platform, usePlatform } from './usePlatform';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);

const DEVICE_ID_KEY = 'deviceId';

interface FcmState {
  isSupported: boolean;
  permission: NotificationPermission;
  platform: Platform;
  deviceId: string | null;
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
  const { platform, isLoading: isPlatformLoading } = usePlatform();

  const [state, setState] = useState<FcmState>({
    isSupported: false,
    permission: 'default',
    platform: 'WEB',
    deviceId: null,
    token: null,
    isLoading: true,
    error: null,
  });

  /**
   * FCM 초기화
   */
  useEffect(() => {
    if (isPlatformLoading) {
      return;
    }

    async function initialize() {
      try {
        const supported = await isSupported();

        /**
         * Device ID 생성 또는 조회
         */
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);

        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }

        setState((prev) => ({
          ...prev,
          isSupported: supported,
          permission: supported ? Notification.permission : 'denied',
          platform,
          deviceId,
          isLoading: false,
          error: null,
        }));

        if (!supported) {
          return;
        }

        /**
         * Firebase Messaging Service Worker 등록
         */
        if (!('serviceWorker' in navigator)) {
          setState((prev) => ({
            ...prev,
            error: 'Service Worker를 지원하지 않는 브라우저입니다.',
          }));

          return;
        }

        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (error) {
        console.error(error);

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'FCM 초기화에 실패했습니다.',
        }));
      }
    }

    initialize();
  }, [platform, isPlatformLoading]);

  /**
   * Notification 권한 요청
   */
  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();

      setState((prev) => ({
        ...prev,
        permission,
      }));

      return permission === 'granted';
    } catch (error) {
      console.error(error);

      setState((prev) => ({
        ...prev,
        error: 'Notification 권한 요청에 실패했습니다.',
      }));

      return false;
    }
  }, [state.isSupported]);

  /**
   * FCM Token 발급
   */
  const registerToken = useCallback(async () => {
    if (!state.isSupported) {
      return null;
    }

    let permission = state.permission;

    /**
     * Notification 권한이 없는 경우 권한 요청
     */
    if (permission !== 'granted') {
      const granted = await requestPermission();

      if (!granted) {
        return null;
      }

      permission = 'granted';
    }

    try {
      /**
       * Firebase Messaging Service Worker가 준비될 때까지 대기
       */
      const registration = await navigator.serviceWorker.ready;

      const messaging = getMessaging(app);

      /**
       * FCM Token 발급
       */
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        setState((prev) => ({
          ...prev,
          error: 'FCM Token을 발급받지 못했습니다.',
        }));

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

  /**
   * FCM Token 삭제
   */
  const removeToken = useCallback(async () => {
    try {
      const messaging = getMessaging(app);

      await deleteToken(messaging);

      setState((prev) => ({
        ...prev,
        token: null,
        error: null,
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
