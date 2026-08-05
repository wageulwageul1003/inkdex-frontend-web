import { format, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import useCalendar from '@/providers/useCalendar';
import { useGetMyPostArchiveList } from '@/hooks/mypage/useGetMyPostArchiveList';
import { useGetMyPostsArchivePostsList } from '@/hooks/mypage/useGetMyPostsArchivePostsList';
import { Card } from '@/components/shared/Card';

export const Calendar = () => {
  const calendar = useCalendar();
  const today = React.useMemo(() => new Date(), []);
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);

  const monthLabel = format(calendar.currentDate, 'yyyy년 M월');

  const { data } = useGetMyPostArchiveList({
    year: String(calendar.currentDate.getFullYear()),
    month: String(calendar.currentDate.getMonth() + 1),
  });

  const { data: detailData } = useGetMyPostsArchivePostsList({
    year: calendar.currentDate.getFullYear(),
    month: calendar.currentDate.getMonth() + 1,
    day: calendar.currentDate.getDay(),
  });

  console.log(detailData);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="buttonIconTextOnly"
            size="buttonIconMedium"
            onClick={calendar.goToPrevMonth}
          >
            <ChevronLeftIcon className="size-6 text-gray-09" />
          </Button>

          <span className="font-m-1 text-gray-09">{monthLabel}</span>

          <Button
            type="button"
            variant="buttonIconTextOnly"
            size="buttonIconMedium"
            onClick={calendar.goToNextMonth}
          >
            <ChevronRightIcon className="size-6 text-gray-09" />
          </Button>
        </div>

        <span className="font-xs-2 text-gray-06">
          {data?.data.filter((item) => item.count > 0).length ?? 0}일
        </span>
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
        {data?.data.map((item) => {
          const date = new Date(
            calendar.currentDate.getFullYear(),
            calendar.currentDate.getMonth(),
            item.day,
          );

          const dateKey = format(date, 'yyyy-MM-dd');

          const isToday = isSameDay(date, today);
          const isSelected =
            selectedDay !== null && isSameDay(date, selectedDay);

          return (
            <Drawer key={item.day}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="flex w-full flex-col items-center"
                  onClick={() => setSelectedDay(date)}
                >
                  <div
                    className={cn(
                      'relative aspect-square w-full overflow-hidden rounded-lg bg-gray-02',
                    )}
                  >
                    {item.count >= 1 ? (
                      <Image
                        src={item.thumbnail.imageUrl ?? '/default-image.png'}
                        alt={dateKey}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-02 text-gray-05"></div>
                    )}
                  </div>

                  <div
                    className={cn(
                      'font-s-2 mt-1 flex h-7 w-7 items-center justify-center text-gray-09',
                      isSelected && 'rounded-full bg-gray-03',
                      isToday && 'bg-gray-300',
                    )}
                  >
                    {item.day}
                  </div>
                </button>
              </DrawerTrigger>

              <DrawerContent>
                <DialogTitle>{format(date, 'yyyy-MM-dd')}</DialogTitle>

                {detailData?.data.content.map((c) => (
                  <Card key={c.uuid} item={c} />
                ))}
              </DrawerContent>
            </Drawer>
          );
        })}
      </div>
    </div>
  );
};
