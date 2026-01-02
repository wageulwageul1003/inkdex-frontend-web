import { useRouter } from 'next/navigation';
import React from 'react';

import { Card } from './Card';

import { Loading } from '@/components/shared/Loading';
import Chips from '@/components/shared/chips';
import { useGetCategoryList } from '@/hooks/common/useGetCategoryList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetPostsList } from '@/hooks/home/useGetPostsList';

export const Latest = () => {
  const router = useRouter();
  const { data: categories } = useGetCategoryList();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList({
      category: '',
      size: '3',
      feedType: 'latest',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-scroll px-4 py-2">
        <Chips
          items={[
            { value: '', label: '전체' },
            ...(categories?.data?.content.map((item) => ({
              value: item.slug,
              label: item.name,
            })) || []),
          ]}
          variant="single"
          type="text"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {data?.content.map((item) => <Card key={item.id} item={item} />)}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
