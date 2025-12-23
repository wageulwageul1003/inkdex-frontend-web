import { useRouter } from 'next/navigation';
import React from 'react';

import { Card } from '../../home/_components/Card';

import { Loading } from '@/components/shared/Loading';
import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { useGetCategoryList } from '@/hook/common/useGetCategoryList';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';
import { useGetPostsList } from '@/hook/home/useGetPostsList';

export const Feed = () => {
  const router = useRouter();
  const { data: categories } = useGetCategoryList();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList({
      category: '',
      size: '3',
      feedType: 'recommended',
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

      {/* 날짜 필터 + 카테고리 개수 */}
      <div className="flex items-center gap-3 px-4 py-2">
        {/* 날짜 필터 */}
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <span className="font-s-2 text-gray-08">날짜</span>
          <Icons.keyboardArrowDown className="size-4 fill-gray-06" />
        </Button>

        {/* 카테고리 개수 */}
        <div className="flex gap-2"></div>
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
