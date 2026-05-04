import { useRouter } from 'next/navigation';
import React from 'react';

import { Card } from './Card';

import { Loading } from '@/components/shared/Loading';
import { useGetCategoryList } from '@/hooks/category/useGetCategoryList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetPostsList } from '@/hooks/home/useGetPostsList';

export const Follow = () => {
  const router = useRouter();
  const { data: categories } = useGetCategoryList();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList({
      category: '',
      size: '3',
      feedType: 'follow',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <div className="mt-4 flex flex-col gap-4">
        {data?.content.map((item) => <Card key={item.uuid} item={item} />)}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
