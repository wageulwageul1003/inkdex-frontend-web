'use client';

import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { UserProfile } from '@/components/shared/user-profile';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetFollowerList } from '@/hooks/follow/useGetFollowerList';

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
      <div className="flex flex-col gap-4">
        {data?.paging.totalElements === 0 && (
          <div className="mt-14 flex flex-col items-center gap-[6px]">
            <Icons.moodEmpty className="size-8 fill-gray-03" />
            <span className="font-s-2 text-gray-05">
              아직 나를 팔로우한 사람이 없어요.
            </span>
          </div>
        )}
        {data?.content.map((item) =>
          (() => {
            return (
              <div className="flex items-center gap-2" key={item.id}>
                <UserProfile
                  userId={item.id}
                  nickname={item.nickname}
                  nicknameSrc={item.profileImageUrl}
                  bio={item.bio}
                  following={item.following}
                  isShowMore={true}
                />
              </div>
            );
          })(),
        )}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
