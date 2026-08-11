import React, { useEffect, useRef, useState } from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface TProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string) => void;
  isInitShowDate: boolean;
}

const YEARS = Array.from({ length: 20 }, (_, i) =>
  String(new Date().getFullYear() - i),
);

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1));

const ITEM_HEIGHT = 44;

export const DatePickerBottomSheet = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  isInitShowDate = false,
}: TProps) => {
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth ?? '1');

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempYear(selectedYear);
    setTempMonth(selectedMonth ?? '1');
  }, [selectedYear, selectedMonth]);

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    items: string[],
    setter: (value: string) => void,
  ) => {
    const element = ref.current;

    if (!element) return;

    const index = Math.round(element.scrollTop / ITEM_HEIGHT);

    setter(items[index]);
  };

  const handleSubmit = () => {
    setSelectedYear(tempYear);
    setSelectedMonth(tempMonth);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {isInitShowDate ? (
          <Button className="flex h-10 items-center justify-center border-none px-0">
            <span className="font-m-1 text-gray-10">
              {selectedYear}년 {selectedMonth && selectedMonth + `월`}
            </span>
            <Button variant="buttonIconTextOnly" size="buttonIconMedium">
              <Icons.keyboardArrowDown className="size-5 shrink-0 fill-gray-08" />
            </Button>
          </Button>
        ) : (
          <Button className="flex h-9 w-9 items-center justify-center rounded-full border-none bg-white p-0">
            <Icons.keyboardArrowDown className="size-6 shrink-0 fill-sand-08" />
          </Button>
        )}
      </DrawerTrigger>

      <DrawerContent className="flex max-h-[400px] flex-col">
        <div className="relative flex h-[220px] justify-center overflow-hidden px-8">
          {/* 선택 영역 */}
          <div className="pointer-events-none absolute left-4 right-4 top-1/2 h-11 -translate-y-1/2 rounded-lg bg-gray-100" />

          <div className="flex gap-6">
            {/* 년도 */}
            <PickerColumn
              ref={yearRef}
              items={YEARS}
              value={tempYear}
              onScroll={() => handleScroll(yearRef, YEARS, setTempYear)}
            />

            <span className="flex items-center">년</span>

            {/* 월 */}
            <PickerColumn
              ref={monthRef}
              items={MONTHS}
              value={tempMonth}
              onScroll={() => handleScroll(monthRef, MONTHS, setTempMonth)}
            />

            <span className="flex items-center">월</span>
          </div>
        </div>

        <DrawerFooter className="sticky bottom-3 z-10 bg-white px-4">
          <DrawerClose asChild>
            <Button variant="contained" size="lg" onClick={handleSubmit}>
              적용하기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

interface PickerColumnProps {
  items: string[];
  value: string;
  onScroll: () => void;
}

const PickerColumn = React.forwardRef<HTMLDivElement, PickerColumnProps>(
  ({ items, onScroll }, ref) => {
    return (
      <div
        ref={ref}
        onScroll={onScroll}
        className="scrollbar-hide h-[220px] w-20 snap-y snap-mandatory overflow-y-scroll text-center"
      >
        {/* 위 여백 */}
        <div className="h-[88px]" />

        {items.map((item) => (
          <div
            key={item}
            className="flex h-11 snap-center items-center justify-center text-lg"
          >
            {item}
          </div>
        ))}

        {/* 아래 여백 */}
        <div className="h-[88px]" />
      </div>
    );
  },
);

PickerColumn.displayName = 'PickerColumn';
