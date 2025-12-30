'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';
import { useGetBookmarkList } from '@/hook/posts/bookmark/useGetBookmarkList';

export const Bookmark = () => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetBookmarkList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <div className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-20">
          {data?.content.map((item) => (
            <div key={item.postId} className="bg-gray-05">
              <div>{item.postId}</div>
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
