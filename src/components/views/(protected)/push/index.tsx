'use client';

import { Bell } from 'lucide-react';
import React from 'react';

import { useFcm } from '@/providers/push/useFcm';
import { usePostRegisterFcmToken } from '@/hooks/notification/usePostRegisterFcmToken';

export const Push = () => {
  const { mutateAsync: postRegisterFcmToken } = usePostRegisterFcmToken();
  const { registerToken } = useFcm();

  const registerFcmToken = async () => {
    const token = await registerToken();

    if (!token) {
      return;
    }

    await postRegisterFcmToken({
      token,
      platform: 'WEB',
      deviceId: crypto.randomUUID(),
    });
  };

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8" />
        <h1 className="text-2xl font-bold">푸시 알림 설정</h1>
      </div>

      <p onClick={() => registerFcmToken()}>활성화</p>
    </div>
  );
};
