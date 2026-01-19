import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface TRemindTimeProps {
  selectedRemindTime: string;
  setSelectedRemindTime: (time: string) => void;
}

export const RemindTime = (props: TRemindTimeProps) => {
  const { selectedRemindTime, setSelectedRemindTime } = props;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <span>{selectedRemindTime}</span>
      </DrawerTrigger>
      <DrawerContent className="flex max-h-[624px] flex-col">
        <DrawerHeader>
          <DrawerTitle>리마인드 알림 시간 설정</DrawerTitle>
        </DrawerHeader>

        {/* TODO: 리마인드 알림 시간 ui */}

        <DrawerFooter className="sticky bottom-3 z-10 bg-white px-4">
          <DrawerClose asChild>
            <Button variant="contained" size="lg">
              적용하기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
