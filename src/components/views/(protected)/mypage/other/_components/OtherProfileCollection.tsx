'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { useGetCollectionList } from '@/hooks/collection/useGetCollectionList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

interface IOtherProfileCollection {
  accountUuid: string;
}

export const OtherProfileCollection = ({
  accountUuid,
}: IOtherProfileCollection) => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCollectionList({
      size: '10',
      accountUuid: accountUuid,
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-1 gap-y-7">
        {data?.content.map((item) => (
          <div
            key={item.uuid}
            onClick={() => router.push(`/collection/detail/${item.uuid}`)}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-gray-02">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <span className="font-m-2 mt-2 line-clamp-1 text-gray-09">
              {item.name}
            </span>

            <div className="mt-[2px] flex items-center gap-1">
              <Icons.inbox className="size-4 fill-gray-05" />
              <span className="font-xs-2 text-gray-05">
                {item.postsCount.toLocaleString()}개
              </span>
            </div>
          </div>
        ))}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
