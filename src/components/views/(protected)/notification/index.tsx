'use client';

import React from 'react';

import { useGetNotificationList } from '@/hooks/notification/useGetNotificationList';
import { Header } from '@/components/shared/layout/Header';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/shared/Loading';
import { NOTIFICATION_TYPE } from '@/types/notification.types';
import FollowerNotification from './_components/FollowerNotification';

const NotificationView = () => {
  const router = useRouter();
  const { data, isLoading } = useGetNotificationList();

  if (isLoading) return <Loading />;

  return (
    <div className="w-full px-4">
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

      <div className="flex flex-col">
        {data?.data.map((item) => (
          <div key={item.date}>
            <span className="font-s-2 py-2 text-gray-05">{item.date}</span>

            {item.notifications.map((notification) => {
              switch (notification.type) {
                case NOTIFICATION_TYPE.FOLLOWER:
                  return (
                    <FollowerNotification
                      key={notification.uuid}
                      uuid={notification.sender.uuid}
                      nickname={notification.sender.nickname}
                      profileImageUrl={notification.sender.profileImageUrl}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationView;
