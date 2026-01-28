import { WheelPickerWrapper } from '@ncdai/react-wheel-picker';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { WheelPicker, WheelPickerOption } from '@/components/wheel-picker';
import { usePatchNotificationSetting } from '@/hooks/notification/usePatchNotificationSetting';

interface TRemindTimeProps {
  selectedRemindTime?: string;
}

export const RemindTime = (props: TRemindTimeProps) => {
  const { selectedRemindTime } = props;
  const { mutateAsync: patchNotificationSetting } =
    usePatchNotificationSetting();

  const [meridiem, setMeridiem] = useState<string>('AM');
  const [hour, setHour] = useState<number>(9);
  const [minute, setMinute] = useState<number>(0);

  useEffect(() => {
    if (!selectedRemindTime) return;

    const [hhRaw, mmRaw] = selectedRemindTime.split(':');
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);

    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return;

    const nextMeridiem = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;

    setMeridiem(nextMeridiem);
    setHour(hour12);
    setMinute(mm);
  }, [selectedRemindTime]);

  const createArray = (length: number, add = 0): WheelPickerOption<number>[] =>
    Array.from({ length }, (_, i) => {
      const value = i + add;
      return {
        label: value.toString().padStart(2, '0'),
        value: value,
      };
    });

  const hourOptions = createArray(12, 1);
  const minuteOptions = createArray(60);

  const meridiemOptions: WheelPickerOption[] = [
    { label: '오전', value: 'AM' },
    { label: '오후', value: 'PM' },
  ];

  const pad2 = (v: number) => v.toString().padStart(2, '0');

  const to24Hour = (h: number, m: string) => {
    const normalized = h % 12;
    return m === 'PM' ? normalized + 12 : normalized;
  };

  const displayRemindTime = (() => {
    const raw = selectedRemindTime ?? '09:00';
    const [hhRaw, mmRaw] = raw.split(':');
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);

    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return raw;

    const meridiemLabel = hh >= 12 ? '오후' : '오전';
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;

    return `${meridiemLabel} ${pad2(hour12)}:${pad2(mm)}`;
  })();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <span>{displayRemindTime}</span>
      </DrawerTrigger>
      <DrawerContent className="flex max-h-[624px] flex-col">
        <DrawerHeader>
          <span className="font-s-1 text-gray-09">리마인드 알림 시간 설정</span>
        </DrawerHeader>

        <div className="my-5 flex items-center justify-center px-4">
          <WheelPickerWrapper>
            <WheelPicker
              options={meridiemOptions}
              defaultValue={meridiem}
              onValueChange={setMeridiem}
            />
            <WheelPicker
              options={hourOptions}
              defaultValue={hour}
              onValueChange={setHour}
              infinite
            />
            <span className="font-xxxl-2 translate-y-20 text-gray-05">:</span>
            <WheelPicker
              options={minuteOptions}
              defaultValue={minute}
              onValueChange={setMinute}
              infinite
            />
          </WheelPickerWrapper>
        </div>

        <DrawerFooter className="sticky bottom-3 z-10 bg-white px-4 pt-2">
          <DrawerClose asChild>
            <Button
              variant="contained"
              size="lg"
              onClick={() => {
                const hh = to24Hour(hour, meridiem);
                const timeValue = `${pad2(hh)}:${pad2(minute)}`;

                patchNotificationSetting({
                  slug: 'remindTime',
                  timeValue,
                });
              }}
            >
              적용하기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
