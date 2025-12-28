'use client';

import { useState } from 'react';

import { nativeBridge } from '@/lib/native-bridge';

export const Notification = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (isEnabled) {
      // 비활성화
      setIsEnabled(false);
      setFcmToken(null);
    } else {
      // 활성화
      setLoading(true);
      try {
        // 1. 알림 권한 요청
        const permissionResult =
          await nativeBridge.requestNotificationPermission();

        if (permissionResult.granted) {
          // 2. FCM 토큰 가져오기
          const tokenResult = await nativeBridge.getFCMToken();

          if (tokenResult.token) {
            setFcmToken(tokenResult.token);
            setIsEnabled(true);

            // 3. 서버에 FCM 토큰 저장
            console.log('FCM Token:', tokenResult.token);
            // TODO: API 호출하여 서버에 토큰 저장
            // await saveFCMTokenToServer(tokenResult.token);
          } else {
            const errorMsg =
              (tokenResult as any).error || 'FCM 토큰을 가져올 수 없습니다.';
            alert(errorMsg);
            console.error('Token error:', tokenResult);
          }
        } else {
          alert('알림 권한이 거부되었습니다.');
        }
      } catch (error) {
        console.error('Notification error:', error);
        alert('알림 설정 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">푸시 알림 설정</h1>

      <div className="mb-4 flex items-center justify-between rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">푸시 알림</h2>
          <p className="text-sm text-gray-600">
            새로운 소식을 알림으로 받아보세요
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative h-8 w-14 rounded-full transition-colors ${
            isEnabled ? 'bg-blue-500' : 'bg-gray-300'
          } ${loading ? 'opacity-50' : ''}`}
        >
          <div
            className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {fcmToken && (
        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <h3 className="mb-2 font-semibold">FCM Token</h3>
          <p className="break-all text-xs text-gray-600">{fcmToken}</p>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center text-gray-600">알림 설정 중...</div>
      )}
    </div>
  );
};
