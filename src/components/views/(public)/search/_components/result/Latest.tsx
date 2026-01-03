import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Card } from '../../../home/_components/Card';

import { NoResult } from './no-result';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetLatestPostsList } from '@/hooks/search/useGetLatestPostsList';

export const Latest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetLatestPostsList({
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
          {data?.content.map((item) => <Card key={item.id} item={item} />)}
          <div ref={observerRef} className="flex h-1 justify-center">
            {isFetchingNextPage && <Loading />}
          </div>
        </div>
      )}
    </div>
  );
};
