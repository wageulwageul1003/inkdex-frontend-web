'use client';

import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetNotificationList } from '@/hooks/notification/useGetNotificationList';

export const Notification = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetNotificationList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      {data?.content.map((item) => (
        <div key={item.uuid} className="flex">
          <p>읽음 처리</p>
          <p>{item.createdAt}</p>
        </div>
      ))}
      <div ref={observerRef} className="flex h-1 justify-center">
        {isFetchingNextPage && <Loading />}
      </div>
    </div>
  );
};
