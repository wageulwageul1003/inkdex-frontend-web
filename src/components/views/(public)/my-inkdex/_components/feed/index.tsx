import React from 'react';

import { SelectCalendar } from '../calendar/Select-Calendar';

import { Icons } from '@/components/shared/icons';
import { useGetMyInkdexFeedList } from '@/hooks/my-inkdex/useGetMyInkdexFeedList';
import { useGetPostsCount } from '@/hooks/my-inkdex/useGetPostsCount';

export const Feed = () => {
  const [selectedStartAt, setselectedStartAt] = React.useState<string | null>(
    null,
  );
  const [selectedEndAt, setselectedEndAt] = React.useState<string | null>(null);

  const { data: count } = useGetPostsCount({
    startAt: selectedStartAt,
    endAt: selectedEndAt,
  });
  const { data } = useGetMyInkdexFeedList({
    startAt: selectedStartAt,
    endAt: selectedEndAt,
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-scroll px-4 py-2"></div>

      {/* 날짜 필터 + 카테고리 개수 */}
      <div className="flex items-center gap-3 px-4 py-2">
        {/* 날짜 필터 */}
        <SelectCalendar
          selectedStartAt={selectedStartAt}
          setselectedStartAt={setselectedStartAt}
          selectedEndAt={selectedEndAt}
          setselectedEndAt={setselectedEndAt}
        />

        {/* 카테고리 개수 */}
        <div className="flex gap-2"></div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {data?.data.length === 0 ? (
          <div className="mt-14 flex flex-col items-center gap-[6px]">
            <Icons.moodEmpty className="size-8 fill-gray-03" />
            <span className="font-s-2 text-gray-05">
              피드가 비어 있어요. <br />
              당신의 첫 기록을 남겨보세요.
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
