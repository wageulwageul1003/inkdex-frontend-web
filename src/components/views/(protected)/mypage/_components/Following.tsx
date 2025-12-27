'use client';

import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { useGetFollowingList } from '@/hook/auth/useGetFollowingList';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';

export const Following = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetFollowingList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div>
      <div className="flex flex-col gap-4">
        {data?.content.map((item) =>
          (() => {
            return <div>{item.nickname}</div>;
          })(),
        )}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
