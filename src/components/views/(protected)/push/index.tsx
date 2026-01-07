'use client';

import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetNotificationList } from '@/hooks/notification/useGetNotificationList';

export const Notification = () => {
  const router = useRouter();
  const [mode, setMode] = React.useState<'list' | 'detail'>('list');
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetNotificationList({
      size: '3',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <div className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-1">
          {data?.content.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                listRefs.current[index] = el;
              }}
              className="cursor-pointer"
            >
              <div>{item.bookmarked}</div>
            </div>
          ))}
        </div>

        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
