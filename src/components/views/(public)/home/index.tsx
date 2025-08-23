'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Card } from './_components/Card';
import { CategoryFilter } from './_components/CategoryFilter';

import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

export const categoryItems = [
  {
    value: 'all',
    label: '전체',
  },
  {
    value: 'photo',
    label: '사진',
  },
  {
    value: 'video',
    label: '동영상',
  },
];

export const Home = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <div className="w-full py-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200"
              onClick={() => setOpen(true)}
            >
              <Icons.plus className="size-3 fill-black" />
            </div>
            <Chips items={categoryItems} variant="multiple" />
          </div>
          <div className="mt-4">
            <Card nickname="nickname" viewCounting={1} nicknameSrc="" src="" />
          </div>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom">
          <div className="w-full">
            <SheetTitle className="pt-7 text-center">
              <span>카테고리 편집</span>
            </SheetTitle>
          </div>
          <CategoryFilter />
        </SheetContent>
      </Sheet>
    </div>
  );
};
