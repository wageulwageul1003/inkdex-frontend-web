import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Card } from '../../../home/_components/Card';
import { SelectCalendar } from '../calendar/Select-Calendar';

import { Loading } from '@/components/shared/Loading';
import Chips from '@/components/shared/chips';
import { useGetCategoryList } from '@/hooks/category/useGetCategoryList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { useGetMyInkdexFeedList } from '@/hooks/my-inkdex/useGetMyInkdexFeedList';

export const Feed = () => {
  const router = useRouter();
  const [selectedStartDate, setSelectedStartDate] = React.useState<
    string | null
  >(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<string | null>(
    null,
  );
  const { data: categories } = useGetCategoryList();

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
        {data?.content.map((item) => <Card key={item.id} item={item} />)}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
