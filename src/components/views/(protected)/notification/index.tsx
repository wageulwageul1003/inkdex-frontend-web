'use client';

import { Bell, BellOff } from 'lucide-react';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { usePushNotification } from '@/providers/push/usePushNotification';

export const Notification = () => {
  const {
    isSupported,
    permission,
    fcmToken,
    isLoading,
    error,
    requestPermission,
    clearToken,
  } = usePushNotification();

  const isEnabled = !!fcmToken;

  const handleEnableNotifications = async () => {
    await requestPermission();
  };

  const handleDisableNotifications = () => {
    clearToken();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isSupported) {
    return (
      <div className="flex w-full flex-col items-center justify-center p-8">
        <BellOff className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-xl font-semibold">
          푸시 알림을 지원하지 않습니다
        </h2>
        <p className="text-center text-gray-600">
          네이티브 앱에서만 푸시 알림을 지원합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8" />
        <h1 className="text-2xl font-bold">푸시 알림 설정</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-semibold">오류</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">알림 상태</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">알림 권한:</span>
            <span
              className={`font-semibold ${
                permission === 'granted'
                  ? 'text-green-600'
                  : permission === 'denied'
                    ? 'text-red-600'
                    : 'text-yellow-600'
              }`}
            >
              {permission === 'granted'
                ? '허용됨'
                : permission === 'denied'
                  ? '거부됨'
                  : '대기 중'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">푸시 알림:</span>
            <span
              className={`font-semibold ${isEnabled ? 'text-green-600' : 'text-gray-600'}`}
            >
              {isEnabled ? '활성화' : '비활성화'}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">알림 관리</h2>
        <div className="space-y-3">
          {!isEnabled ? (
            <button
              onClick={handleEnableNotifications}
              disabled={permission === 'denied'}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Bell className="h-5 w-5" />
              알림 활성화
            </button>
          ) : (
            <button
              onClick={handleDisableNotifications}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700"
            >
              <BellOff className="h-5 w-5" />
              알림 비활성화
            </button>
          )}

          {permission === 'denied' && (
            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
              <p className="text-sm">
                알림 권한이 거부되었습니다. 앱 설정에서 알림 권한을
                허용해주세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {isEnabled && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">FCM 토큰</h2>
          <div className="overflow-x-auto">
            <pre className="whitespace-pre-wrap break-all rounded bg-gray-100 p-4 text-xs">
              {fcmToken}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
