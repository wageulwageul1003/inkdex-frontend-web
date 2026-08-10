import React, { useState } from 'react';

import { useGetMyPostList } from '@/hooks/mypage/useGetMyPostList';
import dayjs from 'dayjs';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import Image from 'next/image';
import { Loading } from '@/components/shared/Loading';
import { useGetActiveEmotionList } from '@/hooks/emotion/useGetActiveEmotionList';
import { DatePickerBottomSheet } from '../../../home/_components/DatePickerBottomSheet';
import { Icons } from '@/components/shared/icons';
import Chips from '@/components/shared/chips';
import { useRouter } from 'next/navigation';

export const Feed = () => {
  const router = useRouter();
  const { data: activeEmotions } = useGetActiveEmotionList();

  const [selectedYear, setSelectedYear] = useState(
    dayjs(new Date()).format('YYYY'),
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState('all');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMyPostList({
      size: '3',
      year: selectedYear,
      month: selectedMonth,
      emotion: selectedEmotion,
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-scroll px-4 py-2"></div>

      <div className="flex items-center justify-between">
        {/* TODO: 초기에 미노출됨 */}
        <DatePickerBottomSheet
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <div className="flex items-center gap-1">
          <Icons.inbox className="size-4 fill-gray-05" />
          <p className="font-xs-2 text-gray-05">
            {data?.paging.totalElements.toLocaleString()}개
          </p>
        </div>
      </div>

      <Chips
        items={[
          {
            label: '전체',
            value: 'all',
          },
          ...(activeEmotions?.data.map((emotion) => ({
            label: emotion.name,
            value: emotion.uuid,
          })) ?? []),
        ]}
        size="sm"
        onValueChange={(value) => setSelectedEmotion(value as string)}
      />

      <div className="mt-3 grid grid-cols-2 gap-2">
        {data?.content.map((item) => (
          <div
            key={item.uuid}
            className="relative aspect-square min-h-40 rounded-lg border border-gray-03"
            onClick={() => router.push(`/posts/${item.uuid}`)}
          >
            <Image
              key={item.uuid}
              src={item.imageUrl ?? '/default-image.png'}
              alt={item.source}
              width={100}
              height={100}
              className="aspect-square h-full w-full rounded-lg"
            />
          </div>
        ))}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
