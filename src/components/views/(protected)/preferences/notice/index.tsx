'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { NoticeItem } from './NoticeItem';

import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetFaqCategory } from '@/hooks/faq/useGetFaqCategory';
import { useGetFaqList } from '@/hooks/faq/useGetFaqList';

export const NoticeView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // FAQ 카테고리
  const { data: faqCategory } = useGetFaqCategory();

  // "전체" 카테고리를 추가한 카테고리 목록
  const categoryList = useMemo(() => {
    if (!faqCategory) return [];
    return [
      {
        label: '전체',
        value: 'all',
        disabled: false,
      },
      ...faqCategory,
    ];
  }, [faqCategory]);

  const initialCategory = searchParams.get('faqCategory') || 'all';
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);

  const { data: faqListData } = useGetFaqList({
    categoryCode: selectedCategory,
  });

  const handleCategory = (item: string | string[]) => {
    if (typeof item === 'string') {
      setSelectedCategory(item);
      updateUrlParams(item);
    }
  };

  const updateUrlParams = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (item === 'all') {
      params.delete('categoryCode');
    } else {
      params.set('categoryCode', item);
    }

    router.push(`?${params.toString()}`);
  };

  const handleToggle = (id: string) => {
    if (openItemId === id) {
      setOpenItemId(null);
    } else {
      setOpenItemId(id);
    }
  };

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">공지사항</span>}
      />

      <div className="mt-8">
        <div className="flex gap-2 overflow-x-auto px-4 py-2">
          <Chips
            items={categoryList}
            variant="single"
            selected={selectedCategory}
            onChange={handleCategory}
            type="text"
          />
        </div>

        <div className="flex flex-col gap-1">
          {faqListData?.data.content.map((item, index) => (
            <NoticeItem
              key={item.uuid}
              uuid={item.uuid}
              category={item.faqCategoryName}
              title={item.title}
              content={item.content}
              isExpanded={openItemId === item.uuid}
              onToggle={() => handleToggle(item.uuid)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
