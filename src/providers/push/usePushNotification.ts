'use client';

import { useEffect, useState } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePushNotificationReturn extends PushNotificationState {
  requestPermission: () => Promise<void>;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<void>;
  sendTestNotification: (title: string, body: string) => Promise<void>;
}

export const usePushNotification = (): UsePushNotificationReturn => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    subscription: null,
    isLoading: true,
    error: null,
  });

  // 브라우저 지원 여부 확인
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported =
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;

      setState((prev) => ({
        ...prev,
        isSupported,
        permission: isSupported ? Notification.permission : 'denied',
        isLoading: false,
      }));

      if (isSupported) {
        // 기존 구독 확인
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setState((prev) => ({ ...prev, subscription }));
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    };

    checkSupport();
  }, []);

  // Service Worker 등록
  useEffect(() => {
    if (state.isSupported && 'serviceWorker' in navigator) {
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
  }, [state.isSupported]);

  // 알림 권한 요청
  const requestPermission = async (): Promise<void> => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: '이 브라우저는 푸시 알림을 지원하지 않습니다.',
      }));
      return;
    }

    try {
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
        error: '이 브라우저는 푸시 알림을 지원하지 않습니다.',
      }));
      return null;
    }

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
