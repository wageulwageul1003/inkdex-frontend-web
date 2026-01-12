import { format, isSameDay, isSameMonth } from 'date-fns';
import dayjs from 'dayjs';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { useGetMyInkdexCalendar } from '@/hooks/my-inkdex/useGetMyInkdexCalendar';
import { useGetPostsCount } from '@/hooks/my-inkdex/useGetPostsCount';
import { cn } from '@/lib/utils';
import useCalendar from '@/providers/useCalendar';

export const Calendar = () => {
  const calendar = useCalendar();
  const today = React.useMemo(() => new Date(), []);
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);

  const monthLabel = format(calendar.currentDate, 'yyyy년 M월');

  const { data: count } = useGetPostsCount({
    startDate: dayjs(calendar.currentDate)
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: dayjs(calendar.currentDate).endOf('month').format('YYYY-MM-DD'),
  });

  const { data } = useGetMyInkdexCalendar({
    year: calendar.currentDate.getFullYear(),
    month: calendar.currentDate.getMonth() + 1,
  });

  const thumbnailMap = React.useMemo(() => {
    if (!data?.data.content) return new Map<string, string>();

    return new Map(
      data.data.content.map((item) => [item.date, item.thumbnailUrl]),
    );
  }, [data]);

  const totalCount = React.useMemo(() => {
    if (!data?.data.content) return 0;
    return (
      count?.data?.content?.reduce((acc, item) => acc + item.count, 0) ?? 0
    );
  }, [count]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="buttonIconTextOnly"
            size="buttonIconMedium"
            onClick={calendar.goToPrevMonth}
            aria-label="이전 달"
          >
            <ChevronLeftIcon className="size-6 text-gray-09" />
          </Button>
          <span className="font-m-1 text-gray-09">{monthLabel}</span>
          <Button
            type="button"
            variant="buttonIconTextOnly"
            size="buttonIconMedium"
            onClick={calendar.goToNextMonth}
            aria-label="다음 달"
          >
            <ChevronRightIcon className="size-6 text-gray-09" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-xs-2 text-gray-06">{totalCount}개</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 pb-2">
        {calendar.dayLabels.map((label) => (
          <div
            key={label}
            className="font-xs-2 flex h-8 items-center justify-center text-gray-06"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendar.weekCalendarList.flat().map((day, idx) => {
          if (day === 0) {
            return <div key={idx} className="aspect-square w-full" />;
          }

          const date = new Date(
            calendar.currentDate.getFullYear(),
            calendar.currentDate.getMonth(),
            day,
          );

          const dateKey = format(date, 'yyyy-MM-dd');
          const thumbnailUrl = thumbnailMap.get(dateKey);

          const isToday = isSameMonth(date, today) && isSameDay(date, today);
          const isSelected =
            selectedDay !== null &&
            isSameMonth(date, selectedDay) &&
            isSameDay(date, selectedDay);

          return (
            <button
              key={idx}
              type="button"
              className="flex w-full flex-col items-center"
              onClick={() => setSelectedDay(date)}
            >
              <div
                className={cn(
                  'relative aspect-square w-full overflow-hidden rounded-lg bg-gray-02',
                  isToday && 'ring-1 ring-gray-04',
                )}
              >
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt={`${dateKey} thumbnail`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div
                className={cn(
                  'font-s-2 mt-1 flex h-7 w-7 items-center justify-center text-gray-09',
                  isSelected && 'rounded-full bg-gray-03',
                )}
              >
                {day}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
