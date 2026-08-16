'use client';

import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { UserProfile } from '@/components/shared/UserProfile';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetFollowerList } from '@/hooks/follow/useGetFollowerList';
import { NoData } from '@/components/shared/NoData';

export const Follower = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetFollowerList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div>
      <div className="flex w-full flex-col">
        {data?.paging.totalElements === 0 && (
          <NoData message="아직 나를 팔로우한 사람이 없어요." />
        )}
        <span className="mt-4 space-y-1">
          {data?.content.map((item) => (
            <div
              className="flex w-full items-center gap-2 py-2"
              key={item.account.uuid}
            >
              <UserProfile
                accountUuid={item.account.uuid}
                nickname={item.account.nickname}
                profileImageUrl={item.account.profileImageUrl}
                bio={item.account.bio}
                following={true}
                isShowMore={false}
              />
            </div>
          ))}
          <div ref={observerRef} className="flex h-1 justify-center">
            {isFetchingNextPage && <Loading />}
          </div>
        </span>
      </div>
    </div>
  );
};
