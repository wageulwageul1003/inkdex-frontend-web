'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Card } from '../../../home/_components/Card';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useDeleteCollection } from '@/hooks/collection/useDeleteCollection';
import { useGetSpecificCollection } from '@/hooks/collection/useGetSpecificCollection';
import { useGetSpecificCollectionList } from '@/hooks/collection/useGetSpecificCollectionList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

interface TProps {
  uuid: string;
}

export const CollectionDetailView = ({ uuid }: TProps) => {
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSpecificCollectionList({
      size: '10',
      collectionUuid: uuid,
    });

  const { data: collectionInfo } = useGetSpecificCollection({
    collectionUuid: uuid,
  });

  const { mutateAsync: deleteCollection } = useDeleteCollection();

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  const handleDeleteCollection = () => {
    deleteCollection({ collectionUuid: uuid }).then(() => {
      router.back();
      toast.success('성공적으로 삭제하였습니다.');
    });
  };

  return (
    <div className="w-full">
      <div className="px-4">
        <Header
          left={
            <Icons.ArrowBackIos
              className="size-6 fill-gray-06"
              onClick={() => router.back()}
            />
          }
          right={
            <div className="relative">
              <Button
                onClick={() => setMoreOpen((prev) => !prev)}
                variant="buttonIconTextOnly"
                size="buttonIconMedium"
              >
                <Icons.moreHoriz className="size-6 fill-gray-08" />
              </Button>

              {moreOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 flex w-[104px] flex-col items-center rounded-lg border border-gray-03 bg-white text-center">
                  <p
                    className="font-m-2 flex h-11 items-center px-2 text-gray-08"
                    onClick={() => router.push(`/collection/edit/${uuid}`)}
                  >
                    정보 편집
                  </p>
                  <p
                    className="font-m-2 flex h-11 items-center px-2 text-red-05"
                    onClick={handleDeleteCollection}
                  >
                    삭제
                  </p>
                </div>
              )}
            </div>
          }
        />
      </div>

      <div className="overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-square w-full bg-gray-02">
          <Image
            src={collectionInfo?.data.imageUrl || '/default-image.png'}
            alt={collectionInfo?.data.name ?? 'collection thumbnail'}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="relative z-10 -mt-4 rounded-t-lg bg-white p-4">
          <p className="font-xs-2 text-gray-06">
            {dayjs(collectionInfo?.data.createdAt).format('YYYY.MM.DD')}
          </p>

          <div className="flex items-center justify-between">
            <p className="font-l-1 mt-1 text-gray-09">
              {collectionInfo?.data.name}
            </p>

            <div className="mt-1 flex items-center gap-1">
              <Icons.inbox className="size-4 fill-gray-05" />
              <p className="font-xs-2 text-gray-05">
                {collectionInfo?.data.postsCount ?? 0}개
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* collection의 post list */}
      {/* TODO: ui 수정 */}
      <div className="flex flex-col">
        {data?.content.map((item) => <Card key={item.uuid} item={item} />)}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>

      {/* collection의 post is 0 */}
      {/* TODO: ui 수정 */}
      <div>
        {data?.content.length === 0 && (
          <div className="flex h-60 items-center justify-center">
            <p className="font-m-2 text-gray-06">아직 게시물이 없어요</p>
            <Button onClick={() => router.push('/posts/write')}>추가</Button>
          </div>
        )}
      </div>
    </div>
  );
};
