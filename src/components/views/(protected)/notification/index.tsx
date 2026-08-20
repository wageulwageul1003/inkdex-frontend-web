'use client';

import React from 'react';

import { useGetNotificationList } from '@/hooks/notification/useGetNotificationList';
import { usePatchNotificationRead } from '@/hooks/notification/usePatchNotificationRead';
import { usePatchNotificationReadAll } from '@/hooks/notification/usePatchNotificationReadAll';
import { Header } from '@/components/shared/layout/Header';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

const NotificationView = () => {
  const router = useRouter();
  const { mutateAsync: patchNotificationRead } = usePatchNotificationRead();
  const { mutateAsync: patchNotificationReadAll } =
    usePatchNotificationReadAll();
  const { data } = useGetNotificationList();

  const handleRead = async (uuid: string) => {
    await patchNotificationRead(uuid);
  };

  const handleReadAll = async () => {
    await patchNotificationReadAll();
  };

  return (
    <div>
      <Header
        left={
          <span onClick={() => router.back()}>
            <Icons.ArrowBackIos className="size-6 fill-gray-06" />
          </span>
        }
        title={<span className="font-m-1 text-black">알림</span>}
        right={
          <Button
            size="buttonIconMedium"
            variant="buttonIconTextOnly"
            onClick={() => router.push(`/block`)}
          >
            <Icons.settings className="size-6 fill-gray-08" />
          </Button>
        }
      />

      <p onClick={() => handleReadAll()}>전체 읽음 처리</p>

      <div className="flex flex-col">
        {data?.data.map((item) => (
          <span className="font-s-2 px-4 py-2 text-gray-05">{item.date}</span>
        ))}
      </div>
    </div>
  );
};

export default NotificationView;
