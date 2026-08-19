'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/Header';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetBlockList } from '@/hooks/auth/block/useGetBlockList';
import { Loading } from '@/components/shared/Loading';
import { BlockUser } from './_components/BlockUser';

export const BlockView = () => {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetBlockList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full flex-1 px-4">
      <Header
        left={
          <span onClick={() => router.back()}>
            <Icons.ArrowBackIos className="size-6 fill-gray-06" />
          </span>
        }
        title={<span className="font-m-1 text-black">차단한 계정 관리</span>}
      />

      <div className="mt-5">
        {data?.content.map((item) => (
          <div className="flex w-full items-center gap-2 py-2" key={item.uuid}>
            <BlockUser
              accountUuid={item.uuid}
              nickname={item.nickname}
              profileImageUrl={item.profileImageUrl}
            />
          </div>
        ))}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
