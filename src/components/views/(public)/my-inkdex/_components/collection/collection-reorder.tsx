'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { useGetCollectionList } from '@/hooks/collection/useGetCollectionList';
import { usePatchCollectionReorder } from '@/hooks/collection/usePatchCollectionReorder';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

export const CollectionReorderView = () => {
  const router = useRouter();

  const { mutateAsync: patchCollectionReorder } = usePatchCollectionReorder();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCollectionList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  const onSubmit = async () => {
    try {
      const response = await patchCollectionReorder({
        collectionUuids: data?.content.map((item) => item.uuid) || [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full bg-white px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">목록 편집</span>}
      />

      <div className="">
        {data?.content.map((item) => (
          <div key={item.uuid} className="flex">
            <Icons.gripVertical className="size-5" />
            <div className="relative aspect-square h-10 w-10 overflow-hidden rounded-sm border border-gray-02">
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
          </div>
        ))}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>

      <Button variant="contained" size="lg" onClick={onSubmit}>
        저장
      </Button>
    </div>
  );
};
