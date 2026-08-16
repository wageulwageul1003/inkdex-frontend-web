import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { NoResult } from './no-result';

import { Loading } from '@/components/shared/Loading';
import { UserProfile } from '@/components/shared/UserProfile';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetUserList } from '@/hooks/search/useGetUserList';
import Cookies from 'js-cookie';
import { USER_UUID } from '@/constants/tokens';

export const User = () => {
  const router = useRouter();
  const userUUID = Cookies.get(USER_UUID);
  const searchParams = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserList({
      searchKeyword: searchParams.get('searchKeyword') || undefined,
      size: '3',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      {data?.paging.totalElements === 0 ? (
        <NoResult />
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {data?.content.map((item) => (
            <div
              key={item.uuid}
              className="cursor-pointer py-2 active:bg-gray-01"
              onClick={() => {
                if (item.uuid === userUUID) router.push(`/my`);
                else router.push(`/my/${item.uuid}`);
              }}
            >
              <UserProfile
                accountUuid={item.uuid}
                nickname={item.nickname}
                profileImageUrl={item.profileImageUrl}
                bio={item.bio}
                following={item.isFollowing}
                isShowMore={false}
              />
            </div>
          ))}
          <div ref={observerRef} className="flex h-1 justify-center">
            {isFetchingNextPage && <Loading />}
          </div>
        </div>
      )}
    </div>
  );
};
