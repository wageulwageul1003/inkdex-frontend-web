import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { NoResult } from './no-result';

import { Loading } from '@/components/shared/Loading';
import { UserProfile } from '@/components/shared/user-profile';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetUserList } from '@/hooks/search/useGetUserList';

export const User = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserList({
      query: searchParams.get('searchKeyword') || undefined,
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
        <div className="mt-4 flex flex-col gap-4">
          {data?.content.map((item) => (
            <UserProfile
              userId={item.id}
              nickname={item.nickname}
              nicknameSrc={item.profileImageUrl}
              bio={item.bio}
              following={false}
              isShowMore={false}
            />
          ))}
          <div ref={observerRef} className="flex h-1 justify-center">
            {isFetchingNextPage && <Loading />}
          </div>
        </div>
      )}
    </div>
  );
};
