'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, isAfter, isBefore, isSameDay, isSameMonth } from 'date-fns';
import React from 'react';
import { useForm } from 'react-hook-form';

import { selectCalendarSchema, TSelectCalendarSchema } from './schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import useCalendar from '@/providers/useCalendar';

interface TProps {
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
}

export const SelectCalendar = (props: TProps) => {
  const { selectedDate, setSelectedDate } = props;
  const calendar = useCalendar();
  const today = React.useMemo(() => new Date(), []);
  const form = useForm({
    resolver: zodResolver(selectCalendarSchema),
    mode: 'onChange',
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  });

  const [rangeStart, setRangeStart] = React.useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const startStr = rangeStart ? format(rangeStart, 'yyyy.MM.dd') : '';
    const endStr = rangeEnd ? format(rangeEnd, 'yyyy.MM.dd') : '';
    form.setValue('startDate', startStr, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('endDate', endStr, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [form, rangeEnd, rangeStart]);

  const onSubmit = (data: TSelectCalendarSchema) => {
    console.log(data);
  };

  const monthLabel = format(calendar.currentDate, 'yyyy년 M월');

  const getDayState = (date: Date) => {
    const isInCurrentMonth = isSameMonth(date, calendar.currentDate);
    const isToday = isSameDay(date, today);

    const hasStart = rangeStart !== null;
    const hasEnd = rangeEnd !== null;
    const isRangeStart = hasStart && isSameDay(date, rangeStart as Date);
    const isRangeEnd = hasEnd && isSameDay(date, rangeEnd as Date);
    const isSingleDayRange =
      hasStart && hasEnd && isSameDay(rangeStart as Date, rangeEnd as Date);

    const isInRange =
      hasStart &&
      hasEnd &&
      !isBefore(date, rangeStart as Date) &&
      !isAfter(date, rangeEnd as Date);

    return {
      isInCurrentMonth,
      isToday,
      isRangeStart,
      isRangeEnd,
      isSingleDayRange,
      isInRange,
    };
  };

  const handleSelectDate = (date: Date) => {
    if (rangeStart === null || (rangeStart !== null && rangeEnd !== null)) {
      setRangeStart(date);
      setRangeEnd(null);
      return;
    }

    if (isBefore(date, rangeStart)) {
      setRangeStart(date);
      setRangeEnd(rangeStart);
      return;
    }

    setRangeEnd(date);
  };

  const handleSave = () => {
    if (rangeStart === null) {
      setSelectedDate(null);
      return;
    }

    const startStr = format(rangeStart, 'yyyy.MM.dd');
    const endStr = rangeEnd ? format(rangeEnd, 'yyyy.MM.dd') : '';
    setSelectedDate(endStr ? `${startStr} - ${endStr}` : startStr);
  };

  const handleReset = () => {
    setRangeStart(null);
    setRangeEnd(null);
    form.reset();
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <span className="font-s-2 text-gray-08">
            {selectedDate ?? '날짜'}
          </span>
          <Icons.keyboardArrowDown className="size-4 fill-gray-06" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex max-h-[598px] flex-col">
        <DrawerHeader>
          <DrawerTitle>날짜 선택</DrawerTitle>
        </DrawerHeader>

        <div className="mt-7 flex-1 px-4 pb-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log('Validation Errors:', errors);
              })}
              className="flex items-center gap-2"
            >
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="startDate"
                placeholder="시작일"
                disabled
              />
              <Icons.checkIndeterminateSmall className="size-3 shrink-0 fill-black" />
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="endDate"
                placeholder="종료일"
                disabled
              />
            </form>
          </Form>

          {/* calendar 선택 */}
          <div className="mt-5">
            <div className="w-full">
              <div className="relative flex items-center justify-between">
                <Button
                  type="button"
                  variant="buttonIconTextOnly"
                  size="buttonIconMedium"
                  onClick={calendar.goToPrevMonth}
                  aria-label="이전 달"
                >
                  <Icons.keyboardArrowLeft className="size-6 text-gray-09" />
                </Button>

                <span className="font-m-1 absolute left-1/2 -translate-x-1/2 text-gray-09">
                  {monthLabel}
                </span>

                <Button
                  type="button"
                  variant="buttonIconTextOnly"
                  size="buttonIconMedium"
                  onClick={calendar.goToNextMonth}
                  aria-label="다음 달"
                >
                  <Icons.keyboardArrowRight className="size-6 text-gray-09" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 pb-2">
                {calendar.dayLabels.map((label) => (
                  <div
                    key={label}
                    className="font-m-1 flex h-10 items-center justify-center text-gray-06"
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-2">
                {calendar.weekCalendarDates.flat().map((date, idx) => {
                  const state = getDayState(date);

                  return (
                    <button
                      key={idx}
                      type="button"
                      className="relative flex h-10 w-full items-center justify-center"
                      onClick={() => handleSelectDate(date)}
                    >
                      {state.isInRange && (
                        <div
                          className={cn(
                            'absolute inset-y-[0.1px] left-0 right-0 bg-sand-02',
                            (state.isRangeStart || state.isSingleDayRange) &&
                              'left-[calc(50%-20px)] rounded-l-full',
                            (state.isRangeEnd || state.isSingleDayRange) &&
                              'right-[calc(50%-20px)] rounded-r-full',
                            state.isSingleDayRange && 'rounded-full',
                          )}
                        />
                      )}

                      <div
                        className={cn(
                          'font-m-1 relative z-10 flex h-10 w-10 items-center justify-center text-center',
                          state.isInCurrentMonth
                            ? 'text-gray-10'
                            : 'text-gray-10',
                          (state.isRangeStart ||
                            state.isRangeEnd ||
                            state.isSingleDayRange) &&
                            'rounded-full bg-sand-02 text-gray-10',
                          state.isToday && 'ring-2 ring-gray-04',
                        )}
                      >
                        {format(date, 'd')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="sticky bottom-3 z-10 flex flex-row items-center gap-2 bg-white px-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            className="flex-1"
          >
            초기화
          </Button>

          <Button
            variant="contained"
            size="lg"
            onClick={handleSave}
            className="flex-1"
          >
            저장
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
