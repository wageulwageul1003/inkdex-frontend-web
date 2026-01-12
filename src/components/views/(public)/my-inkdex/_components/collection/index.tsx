'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { useGetCollectionList } from '@/hooks/collection/useGetCollectionList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

export const Collection = () => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCollectionList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-1">
          <h2 className="font-m-1 text-gray-09">컬렉션</h2>
          <span className="font-s-2 text-sand-05">
            {data?.paging.totalElements}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="buttonIconOutline" size="buttonIconMedium">
            <Icons.plus className="size-6 fill-black" />
          </Button>
          <Button variant="buttonIconOutline" size="buttonIconMedium">
            <Icons.arrowsSort className="size-6 fill-black" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-1 gap-y-7">
        {data?.content.map((item) => (
          <div
            key={item.collectionId}
            onClick={() =>
              router.push(`/collection/detail/${item.collectionId}`)
            }
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-gray-02">
              <Image
                src={item.thumbnailUrl}
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
                {item.postCount.toLocaleString()}개
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
