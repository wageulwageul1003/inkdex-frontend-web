'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Card } from '../../../home/_components/Card';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetSpecificCollection } from '@/hooks/collection/useGetSpecificCollection';
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

  const { data: collectionInfo } = useGetSpecificCollection({
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
          <Icons.ArrowBackIos
            className="size-6 fill-gray-06"
            onClick={() => router.back()}
          />
        }
      />

      <div className="overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-square w-full bg-gray-02">
          <Image
            src={collectionInfo?.thumbnailUrl || '/default-image.png'}
            alt={collectionInfo?.name ?? 'collection thumbnail'}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="relative z-10 -mt-4 rounded-t-lg bg-white p-4">
          <p className="font-xs-2 text-gray-06">
            {collectionInfo?.createdAt
              ? new Date(collectionInfo.createdAt).toLocaleDateString('ko-KR')
              : ''}
          </p>

          <div className="flex items-center justify-between">
            <p className="font-l-1 mt-1 text-gray-09">{collectionInfo?.name}</p>

            <div className="mt-1 flex items-center gap-1">
              <Icons.inbox className="size-4 fill-gray-05" />
              <p className="font-xs-2 text-gray-05">
                {collectionInfo?.postCount ?? 0}개
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* collection의 post list */}
      <div className="flex flex-col">
        {data?.content.map((item) => <Card key={item.id} item={item} />)}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
