import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Card } from '../../../home/_components/Card';
import { SelectCalendar } from '../calendar/Select-Calendar';

import { Loading } from '@/components/shared/Loading';
import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { useGetCategoryList } from '@/hooks/category/useGetCategoryList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetMyInkdexFeedList } from '@/hooks/my-inkdex/useGetMyInkdexFeedList';
import { useGetPostsCount } from '@/hooks/my-inkdex/useGetPostsCount';
import { IConstant } from '@/types/global';

export const Feed = () => {
  const router = useRouter();
  const [selectedStartDate, setSelectedStartDate] = React.useState<
    string | null
  >(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const { data: categories } = useGetCategoryList();
  const { data: count } = useGetPostsCount({
    startDate: selectedStartDate,
    endDate: selectedEndDate,
  });

  const categoryList = categories?.data?.content ?? [];
  const countList = count?.data?.content ?? [];

  const countMap = countList.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.category] = cur.count;
    return acc;
  }, {});

  const chipItems = countList
    .filter((c) => c.category !== 'all')
    .map((c) => {
      const matchedCategory = categoryList.find(
        (item) => item.slug === c.category,
      );

      if (!matchedCategory) return null;

      return {
        value: matchedCategory.slug,
        label: `${matchedCategory.name} ${c.count}`,
      };
    })
    .filter(Boolean);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMyInkdexFeedList({
      category: '',
      size: '3',
      startDate: selectedStartDate
        ? dayjs(selectedStartDate).format('YYYY-MM-DD')
        : '',
      endDate: selectedEndDate
        ? dayjs(selectedEndDate).format('YYYY-MM-DD')
        : '',
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
            {
              value: 'all',
              label: `전체 ${countMap['all'] ?? 0}`,
            },
            ...(chipItems as IConstant[]),
          ]}
          variant="single"
          type="text"
          selected={selectedCategory}
          onChange={(item) => setSelectedCategory(item as string)}
        />
      </div>

      {/* 날짜 필터 + 카테고리 개수 */}
      <div className="flex items-center gap-3 px-4 py-2">
        {/* 날짜 필터 */}
        <SelectCalendar
          selectedStartDate={selectedStartDate}
          setSelectedStartDate={setSelectedStartDate}
          selectedEndDate={selectedEndDate}
          setSelectedEndDate={setSelectedEndDate}
        />

        {/* 카테고리 개수 */}
        <div className="flex gap-2"></div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {data?.paging.totalElements === 0 ? (
          <div className="mt-14 flex flex-col items-center gap-[6px]">
            <Icons.moodEmpty className="size-8 fill-gray-03" />
            <span className="font-s-2 text-gray-05">
              피드가 비어 있어요. <br />
              당신의 첫 기록을 남겨보세요.
            </span>
          </div>
        ) : (
          <>
            {data?.content.map((item) => <Card key={item.id} item={item} />)}
            <div ref={observerRef} className="flex h-1 justify-center">
              {isFetchingNextPage && <Loading />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
