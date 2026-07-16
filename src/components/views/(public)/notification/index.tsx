'use client';

import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetNotificationList } from '@/hooks/notification/useGetNotificationList';
import { usePatchNotificationRead } from '@/hooks/notification/usePatchNotificationRead';
import { usePatchNotificationReadAll } from '@/hooks/notification/usePatchNotificationReadAll';

export const Notification = () => {
  const { mutateAsync: patchNotificationRead } = usePatchNotificationRead();
  const { mutateAsync: patchNotificationReadAll } =
    usePatchNotificationReadAll();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetNotificationList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  const handleRead = async (uuid: string) => {
    await patchNotificationRead(uuid);
  };

  const handleReadAll = async () => {
    await patchNotificationReadAll();
  };

  return (
    <div>
      <p onClick={() => handleReadAll()}>전체 읽음 처리</p>
      <div className="flex w-full flex-col gap-3">
        {data?.content.map((item) => (
          <div key={item.uuid} className="flex">
            <p onClick={() => handleRead(item.uuid)}>읽음 처리 버튼</p>
            <p className="text-gray-05">{item.isRead ? '읽음' : '안 읽음'}</p>
            <p>{item.createdAt}</p>
          </div>
        ))}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
