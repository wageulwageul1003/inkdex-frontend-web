import { useRouter } from 'next/navigation';
import React from 'react';

import { SelectCalendar } from '../calendar/Select-Calendar';

import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { useGetCategoryList } from '@/hooks/category/useGetCategoryList';
import { useGetMyInkdexFeedList } from '@/hooks/my-inkdex/useGetMyInkdexFeedList';
import { useGetPostsCount } from '@/hooks/my-inkdex/useGetPostsCount';
import { IConstant } from '@/types/global';

export const Feed = () => {
  const router = useRouter();
  const [selectedStartAt, setselectedStartAt] = React.useState<string | null>(
    null,
  );
  const [selectedEndAt, setselectedEndAt] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const { data: categories } = useGetCategoryList();
  const { data: count } = useGetPostsCount({
    startAt: selectedStartAt,
    endAt: selectedEndAt,
  });
  const { data } = useGetMyInkdexFeedList({
    startAt: selectedStartAt,
    endAt: selectedEndAt,
  });

  const categoryList = categories?.data ?? [];
  const countList = count?.data ?? [];

  const totalCount = countList.reduce((sum, cur) => {
    return sum + cur.count;
  }, 0);

  const countMap = countList.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.categoryUuid] = cur.count;
    return acc;
  }, {});

  const chipItems = countList
    .filter((c) => c.categoryUuid !== 'all')
    .map((c) => {
      const matchedCategory = categoryList.find(
        (item) => item.uuid === c.categoryUuid,
      );

      if (!matchedCategory) return null;

      return {
        value: matchedCategory.uuid,
        label: `${matchedCategory.name} ${c.count}`,
      };
    })
    .filter(Boolean);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-scroll px-4 py-2">
        <Chips
          items={[
            {
              value: 'all',
              label: `전체 ${totalCount}`,
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
