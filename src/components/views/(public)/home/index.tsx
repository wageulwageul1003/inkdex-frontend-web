'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Card } from './_components/Card';
import { CategoryFilter } from './_components/CategoryFilter';

import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useGetCategoryList } from '@/hook/common/useGetCategoryList';
import { useGetPostsList } from '@/hook/home/useGetPostsList';

export const Home = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: categories } = useGetCategoryList();
  const { data: posts } = useGetPostsList({
    category: '',
    page: '1',
    size: '10',
    sort: 'createdAt,desc',
  });

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
            <Chips
              items={[
                { value: '', label: '전체' },
                ...(categories?.data?.content.map((item) => ({
                  value: item.slug,
                  label: item.name,
                })) || []),
              ]}
              variant="single"
            />
          </div>
          <div className="mt-4">
            {posts?.data?.content.map((item) => (
              <Card
                nickname={item.userNickname}
                viewCounting={item.viewCount}
                nicknameSrc={item.profileImageUrl || ''}
                src={item.thumbnailUrl}
              />
            ))}
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
