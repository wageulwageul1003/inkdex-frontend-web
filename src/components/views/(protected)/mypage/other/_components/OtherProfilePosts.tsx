'use client';

import React, { useState } from 'react';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

import { Card } from '@/components/shared/Card';
import { useGetPostsList } from '@/hooks/search/useGetPostsList';
import dayjs from 'dayjs';
import { DatePickerBottomSheet } from '@/components/views/(public)/home/_components/DatePickerBottomSheet';
import { Icons } from '@/components/shared/icons';

interface IOtherProfileCollection {
  accountUuid: string;
}

export const OtherProfilePosts = ({ accountUuid }: IOtherProfileCollection) => {
  const [selectedYear, setSelectedYear] = useState(
    dayjs(new Date()).format('YYYY'),
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList({
      size: '3',
      targetAccountUuid: accountUuid,
      year: selectedYear,
      month: selectedMonth,
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between py-3">
        <DatePickerBottomSheet
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          isInitShowDate={true}
        />
        <div className="flex items-center gap-1">
          <Icons.inbox className="size-4 fill-gray-05" />
          <p className="font-xs-2 text-gray-05">
            {data?.paging.totalElements.toLocaleString()}개
          </p>
        </div>
      </div>

      <div>
        <div className="space-y-10">
          {data?.content.map((item) => <Card item={item} isShowBio={false} />)}
        </div>
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
