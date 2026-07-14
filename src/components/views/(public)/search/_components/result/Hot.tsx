import { useSearchParams } from 'next/navigation';
import React from 'react';

import { NoResult } from './no-result';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetSearchPostsList } from '@/hooks/search/useGetSearchPostsList';

export const Hot = () => {
  const searchParams = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSearchPostsList({
      searchKeyword: searchParams.get('searchKeyword') || undefined,
      size: '3',
      feedType: 'hot',
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
          {data?.content.map((item) => <p>{item.account.bio}</p>)}
          <div ref={observerRef} className="flex h-1 justify-center">
            {isFetchingNextPage && <Loading />}
          </div>
        </div>
      )}
    </div>
  );
};
