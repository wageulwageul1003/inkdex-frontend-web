'use client';

import { Bell, BellOff, Send } from 'lucide-react';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { usePushNotification } from '@/providers/push/usePushNotification';

export const Notification = () => {
  const {
    isSupported,
    platform,
    permission,
    subscription,
    expoPushToken,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = usePushNotification();

  const handleEnableNotifications = async () => {
    await requestPermission();
    await subscribe();
  };

  // expoPushToken이 변경되면 alert로 표시
  React.useEffect(() => {
    if (expoPushToken) {
      alert(`Expo Push Token: ${expoPushToken}`);
    }
  }, [expoPushToken]);

  const handleDisableNotifications = async () => {
    await unsubscribe();
  };

  const handleSendTest = async () => {
    await sendTestNotification(
      '테스트 알림',
      '푸시 알림이 정상적으로 작동합니다! 🎉',
    );
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
          현재 브라우저는 푸시 알림을 지원하지 않습니다.
          <br />
          Chrome, Firefox, Safari 등 최신 브라우저를 사용해주세요.
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
            <span className="text-gray-700">브라우저 지원:</span>
            <span
              className={`font-semibold ${isSupported ? 'text-green-600' : 'text-red-600'}`}
            >
              {isSupported ? '지원됨' : '지원 안 됨'}
            </span>
          </div>
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
            <span className="text-gray-700">구독 상태:</span>
            <span
              className={`font-semibold ${subscription ? 'text-green-600' : 'text-gray-600'}`}
            >
              {subscription ? '활성화' : '비활성화'}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">알림 관리</h2>
        <div className="space-y-3">
          {!subscription ? (
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

          <span>플랫폼: {platform}</span>
          <span>푸시 알림 토큰 : {expoPushToken || '없음'}</span>

          {subscription && (
            <button
              onClick={handleSendTest}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-blue-600 bg-white px-4 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              <Send className="h-5 w-5" />
              테스트 알림 보내기
            </button>
          )}

          {permission === 'denied' && (
            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
              <p className="text-sm">
                알림 권한이 거부되었습니다. 브라우저 설정에서 알림 권한을
                허용해주세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {subscription && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">구독 정보</h2>
          <div className="overflow-x-auto">
            <pre className="rounded bg-gray-100 p-4 text-xs">
              {JSON.stringify(subscription.toJSON(), null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-blue-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-blue-900">
          푸시 알림 사용 방법
        </h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-800">
          <li>"알림 활성화" 버튼을 클릭합니다.</li>
          <li>브라우저에서 알림 권한을 허용합니다.</li>
          <li>"테스트 알림 보내기"로 알림이 작동하는지 확인합니다.</li>
          <li>서버에서 푸시 알림을 보낼 수 있습니다.</li>
        </ol>
      </div>
    </div>
  );
};
