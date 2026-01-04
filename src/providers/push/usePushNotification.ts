'use client';

import { useEffect, useState } from 'react';

import { nativeBridge } from '@/lib/native-bridge';

interface PushNotificationState {
  isSupported: boolean;
  permission: 'granted' | 'denied' | 'default' | 'unknown';
  fcmToken: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePushNotificationReturn extends PushNotificationState {
  requestPermission: () => Promise<void>;
  clearToken: () => void;
}

// 네이티브 앱(WebView) 환경인지 확인
const checkIsNative = (): boolean => {
  return (
    typeof window !== 'undefined' && window.ReactNativeWebView !== undefined
  );
};

export const usePushNotification = (): UsePushNotificationReturn => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    fcmToken: null,
    isLoading: true,
    error: null,
  });

  // 네이티브 환경 확인
  useEffect(() => {
    const isNative = checkIsNative();
    setState((prev) => ({
      ...prev,
      isSupported: isNative,
      permission: isNative ? 'unknown' : 'denied',
      isLoading: false,
    }));
  }, []);

  // 알림 권한 요청 및 FCM 토큰 가져오기
  const requestPermission = async (): Promise<void> => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: '네이티브 앱에서만 푸시 알림을 지원합니다.',
      }));
      return;
    }

    try {
      // 알림 권한 요청
      const result = await nativeBridge.requestNotificationPermission();

      if (result.granted) {
        // FCM 토큰 가져오기
        try {
          const fcmResult = await nativeBridge.getFCMToken();
          setState((prev) => ({
            ...prev,
            permission: 'granted',
            fcmToken: fcmResult.token || null,
            error: null,
          }));
          console.log('FCM Token:', fcmResult.token);
        } catch (fcmError) {
          console.error('Failed to get FCM token:', fcmError);
          setState((prev) => ({
            ...prev,
            permission: 'granted',
            error: 'FCM 토큰을 가져오는데 실패했습니다.',
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          permission: 'denied',
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

  // 토큰 초기화
  const clearToken = (): void => {
    setState((prev) => ({
      ...prev,
      fcmToken: null,
      permission: 'default',
      error: null,
    }));
  };

  return {
    ...state,
    requestPermission,
    clearToken,
  };
};
