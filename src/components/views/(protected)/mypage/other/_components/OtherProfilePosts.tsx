'use client';

import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

import { Card } from '@/components/shared/Card';
import { useGetPostsList } from '@/hooks/search/useGetPostsList';

interface IOtherProfileCollection {
  accountUuid: string;
}

export const OtherProfilePosts = ({ accountUuid }: IOtherProfileCollection) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList({
      size: '3',
      targetAccountUuid: accountUuid,
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      {data?.content.map((item) => <Card item={item} isShowBio={false} />)}
      <div ref={observerRef} className="flex h-1 justify-center">
        {isFetchingNextPage && <Loading />}
      </div>
    </div>
  );
};
