import { useSearchParams } from 'next/navigation';
import React from 'react';

import { Card } from '../../../home/_components/Card';

import { NoResult } from './no-result';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetSearchPostsList } from '@/hooks/search/useGetSearchPostsList';

export const Latest = () => {
  const searchParams = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSearchPostsList({
      searchKeyword: searchParams.get('searchKeyword') || undefined,
      size: '3',
      feedType: 'latest',
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
          {data?.content.map((item) => <Card key={item.uuid} item={item} />)}
          <div ref={observerRef} className="flex h-1 justify-center">
            {isFetchingNextPage && <Loading />}
          </div>
        </div>
      )}
    </div>
  );
};
