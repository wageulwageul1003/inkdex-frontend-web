import React, { useEffect, useState } from 'react';

import { Icons } from '@/components/shared/icons';
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
import { VISIBILITY, VisibilityType } from '@/constants/enum';

interface TProps {
  selectedVisibility: VisibilityType;
  setSelectedVisibility: (visibility: VisibilityType) => void;
}

export const Visibility = ({
  selectedVisibility,
  setSelectedVisibility,
}: TProps) => {
  const [tempVisibility, setTempVisibility] =
    useState<VisibilityType>(selectedVisibility);

  useEffect(() => {
    setTempVisibility(selectedVisibility);
  }, [selectedVisibility]);

  const selectedItem = VISIBILITY.find(
    (item) => item.value === selectedVisibility,
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex h-12 w-full items-center justify-between px-3">
          {selectedItem && (
            <div className="flex items-center gap-1">
              {selectedItem.icon}
              <span className="font-m-2 text-gray-08">
                {selectedItem.label}
              </span>
            </div>
          )}

          <Icons.keyboardArrowRight className="size-6 fill-gray-06" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="flex max-h-[624px] flex-col">
        <DrawerHeader>
          <DrawerTitle>공개범위 선택</DrawerTitle>
        </DrawerHeader>

        <div className="mt-7 flex-1 overflow-y-auto px-4 pb-8">
          {VISIBILITY.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTempVisibility(item.value)}
              className="flex h-14 w-full items-center justify-between rounded-lg px-3 py-4"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-m-2 text-gray-08">{item.label}</span>
              </div>

              {tempVisibility === item.value ? (
                <Icons.radioButtonChecked className="fill-primary-01 size-6" />
              ) : (
                <Icons.radioButtonUnchecked className="size-6 fill-gray-04" />
              )}
            </button>
          ))}
        </div>

        <DrawerFooter className="sticky bottom-3 z-10 bg-white px-4">
          <DrawerClose asChild>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSelectedVisibility(tempVisibility)}
            >
              확인
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
