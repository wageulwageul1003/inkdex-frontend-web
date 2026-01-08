'use client';

import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { UserProfile } from '@/components/shared/user-profile';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetFollowingList } from '@/hooks/follow/useGetFollowingList';

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
    <div className="flex w-full flex-col gap-4">
      {data?.paging.totalElements === 0 && (
        <div className="mt-14 flex flex-col items-center gap-[6px]">
          <Icons.moodEmpty className="size-8 fill-gray-03" />
          <span className="font-s-2 text-gray-05">
            아직 팔로우 중인 계정이 없어요.
          </span>
        </div>
      )}
      {data?.content.map((item) =>
        (() => {
          return (
            <div className="flex w-full items-center gap-2" key={item.id}>
              <UserProfile
                nickname={item.nickname}
                nicknameSrc={item.profileImageUrl}
                bio={item.nickname}
                following={true}
                isShowMore={false}
              />
            </div>
          );
        })(),
      )}
      <div ref={observerRef} className="flex h-1 justify-center">
        {isFetchingNextPage && <Loading />}
      </div>
    </div>
  );
};
