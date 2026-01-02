'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetSpecificCollectionList } from '@/hooks/collection/useGetSpecificCollectionList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

interface TProps {
  uuid: string;
}

export const CollectionDetail = ({ uuid }: TProps) => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSpecificCollectionList({
      size: '10',
      collectionId: uuid,
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <Header
        left={
          <Icons.close
            className="size-6 fill-gray-06"
            onClick={() => router.back()}
          />
        }
      />

      <div className="grid grid-cols-2 gap-1">
        {/* {data?.content.map((item) => <Card key={item.id} item={item} />)} */}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
