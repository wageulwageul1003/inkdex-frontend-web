'use client';

import { useEffect, useState } from 'react';

import { nativeBridge } from '@/lib/native-bridge';

type PlatformType = 'web' | 'native' | 'unsupported';

interface PushNotificationState {
  isSupported: boolean;
  platform: PlatformType;
  permission: NotificationPermission | 'unknown';
  subscription: PushSubscription | null;
  expoPushToken: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePushNotificationReturn extends PushNotificationState {
  requestPermission: () => Promise<void>;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<void>;
  sendTestNotification: (title: string, body: string) => Promise<void>;
}

// 네이티브 앱(WebView) 환경인지 확인
const checkIsNative = (): boolean => {
  return (
    typeof window !== 'undefined' && window.ReactNativeWebView !== undefined
  );
};

// 웹 푸시 지원 여부 확인
const checkWebPushSupport = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
};

export const usePushNotification = (): UsePushNotificationReturn => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    platform: 'unsupported',
    permission: 'default',
    subscription: null,
    expoPushToken: null,
    isLoading: true,
    error: null,
  });

  // 플랫폼 및 지원 여부 확인
  useEffect(() => {
    const checkSupport = async () => {
      const isNative = checkIsNative();
      const isWebPushSupported = checkWebPushSupport();

      if (isNative) {
        // Expo 웹뷰 환경
        setState((prev) => ({
          ...prev,
          isSupported: true,
          platform: 'native',
          permission: 'unknown',
          isLoading: false,
        }));
      } else if (isWebPushSupported) {
        // 웹 브라우저 환경
        setState((prev) => ({
          ...prev,
          isSupported: true,
          platform: 'web',
          permission: Notification.permission,
          isLoading: false,
        }));

        // 기존 구독 확인
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setState((prev) => ({ ...prev, subscription }));
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      } else {
        // 지원하지 않는 환경
        setState((prev) => ({
          ...prev,
          isSupported: false,
          platform: 'unsupported',
          permission: 'denied',
          isLoading: false,
        }));
      }
    };

    checkSupport();
  }, []);

  // Service Worker 등록 (웹 환경에서만)
  useEffect(() => {
    if (state.platform === 'web' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          setState((prev) => ({
            ...prev,
            error: 'Service Worker 등록에 실패했습니다.',
          }));
        });
    }
  }, [state.platform]);

  // 알림 권한 요청
  const requestPermission = async (): Promise<void> => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: '푸시 알림을 지원하지 않는 환경입니다.',
      }));
      return;
    }

    try {
      if (state.platform === 'native') {
        // Expo 네이티브 환경: nativeBridge 사용
        const result = await nativeBridge.requestNotificationPermission();
        setState((prev) => ({
          ...prev,
          permission: result.granted ? 'granted' : 'denied',
          expoPushToken: result.token || null,
          error: null,
        }));

        if (result.granted) {
          console.log(
            'Native notification permission granted, token:',
            result.token,
          );
        } else {
          setState((prev) => ({
            ...prev,
            error: '알림 권한이 거부되었습니다.',
          }));
        }
      } else {
        // 웹 브라우저 환경
        const permission = await Notification.requestPermission();
        setState((prev) => ({ ...prev, permission, error: null }));

        if (permission === 'granted') {
          console.log('Notification permission granted');
        } else if (permission === 'denied') {
          setState((prev) => ({
            ...prev,
            error: '알림 권한이 거부되었습니다.',
          }));
        }
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setState((prev) => ({
        ...prev,
        error: '권한 요청 중 오류가 발생했습니다.',
      }));
    }
  };

  // 푸시 구독
  const subscribe = async (): Promise<PushSubscription | null> => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: '푸시 알림을 지원하지 않는 환경입니다.',
      }));
      return null;
    }

    // 네이티브 환경에서는 requestPermission에서 이미 토큰을 받음
    if (state.platform === 'native') {
      if (state.permission !== 'granted') {
        await requestPermission();
      }
      // 네이티브에서는 PushSubscription 대신 expoPushToken 사용
      return null;
    }

    // 웹 브라우저 환경
    if (state.permission !== 'granted') {
      await requestPermission();
      if (Notification.permission !== 'granted') {
        return null;
      }
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // VAPID 공개 키 (실제 서버에서 생성한 키로 교체 필요)
      // 키 생성: npx web-push generate-vapid-keys
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

      if (!vapidPublicKey) {
        console.warn('VAPID public key is not set');
        // 테스트용으로 구독은 진행하되, 실제 푸시는 작동하지 않을 수 있음
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
          ? urlBase64ToUint8Array(vapidPublicKey)
          : undefined,
      });

      setState((prev) => ({ ...prev, subscription, error: null }));

      // 서버에 구독 정보 전송
      // await sendSubscriptionToServer(subscription);

      console.log('Push subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      setState((prev) => ({
        ...prev,
        error: '푸시 구독 중 오류가 발생했습니다.',
      }));
      return null;
    }
  };

  // 푸시 구독 해제
  const unsubscribe = async (): Promise<void> => {
    if (state.platform === 'native') {
      // 네이티브 환경에서는 토큰만 초기화
      setState((prev) => ({
        ...prev,
        expoPushToken: null,
        permission: 'default',
        error: null,
      }));
      console.log('Native push token cleared');
      return;
    }

    if (!state.subscription) {
      return;
    }

    try {
      await state.subscription.unsubscribe();
      setState((prev) => ({ ...prev, subscription: null, error: null }));

      // 서버에 구독 해제 알림
      // await removeSubscriptionFromServer(state.subscription);

      console.log('Push unsubscribed');
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      setState((prev) => ({
        ...prev,
        error: '구독 해제 중 오류가 발생했습니다.',
      }));
    }
  };

  // 테스트 알림 전송 (로컬 테스트용)
  const sendTestNotification = async (
    title: string,
    body: string,
  ): Promise<void> => {
    if (!state.isSupported || state.permission !== 'granted') {
      setState((prev) => ({
        ...prev,
        error: '알림 권한이 필요합니다.',
      }));
      return;
    }

    try {
      if (state.platform === 'native') {
        // 네이티브 환경에서는 서버를 통해 Expo Push 알림 전송 필요
        // 여기서는 토큰이 있다는 것만 확인
        if (state.expoPushToken) {
          console.log('Native test notification - token:', state.expoPushToken);
          // TODO: 서버 API를 통해 Expo Push 알림 전송
          // await fetch('/api/push/send', { ... })
          setState((prev) => ({
            ...prev,
            error: '네이티브 테스트 알림은 서버를 통해 전송해야 합니다.',
          }));
        }
        return;
      }

      // 웹 브라우저 환경
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body,
        icon: '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png',
        tag: 'test-notification',
        requireInteraction: false,
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      setState((prev) => ({
        ...prev,
        error: '테스트 알림 전송 중 오류가 발생했습니다.',
      }));
    }
  };

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
};

// VAPID 키를 Uint8Array로 변환하는 헬퍼 함수
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 서버에 구독 정보 전송 (구현 필요)
// async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
//   const response = await fetch('/api/push/subscribe', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(subscription),
//   });
//
//   if (!response.ok) {
//     throw new Error('Failed to send subscription to server');
//   }
// }

// 서버에서 구독 정보 제거 (구현 필요)
// async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
//   const response = await fetch('/api/push/unsubscribe', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(subscription),
//   });
//
//   if (!response.ok) {
//     throw new Error('Failed to remove subscription from server');
//   }
// }
