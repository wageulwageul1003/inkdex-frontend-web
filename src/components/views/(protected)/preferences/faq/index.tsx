'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { FaqItem } from './_components/FaqItem';

import { useGetFaqList } from '@/hook/faq/useGetFaqList';

export const FaqComponent = () => {
  const searchParams = useSearchParams();
  const faqCategoryName = searchParams.get('faqCategoryName') || undefined;
  const { data: faqListData } = useGetFaqList({
    constFaqType: 'support',
    faqCategoryName,
  });
  const router = useRouter();
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // FAQ 카테고리
  //   const { constants: faqSupport } = useSpecificConstant('const_faq_support');

  // "전체" 카테고리를 추가한 카테고리 목록
  //   const categoryList = useMemo(() => {
  //     if (!faqSupport) return [];
  //     return [
  //       {
  //         label: '전체',
  //         value: '전체',
  //         disabled: false,
  //       },
  //       ...faqSupport,
  //     ];
  //   }, [faqSupport]);

  const initialCategory = searchParams.get('faqCategoryName') || '전체';
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);

  const handleCategory = (item: string | string[]) => {
    if (typeof item === 'string') {
      setSelectedCategory(item);
      updateUrlParams(item);
    }
  };

  const updateUrlParams = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Process category parameter
    if (item === '전체') {
      params.delete('faqCategoryName');
    } else {
      params.set('faqCategoryName', item);
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
    <div>
      {/* <div className="mt-4">
        <div className="flex-1 overflow-hidden">
          <Chips
            items={categoryList}
            variant="single"
            selected={selectedCategory}
            onChange={handleCategory}
          />
        </div>
      </div> */}

      <div className="mt-1"></div>

      {faqListData?.data.content.map((item, index) => (
        <div
          key={item.uuid}
          className={
            index === faqListData.data.content.length - 1
              ? ''
              : 'border-b border-gray-200'
          }
        >
          <FaqItem
            uuid={item.uuid}
            category={item.faqCategoryName}
            title={item.title}
            content={item.content}
            isExpanded={openItemId === item.uuid}
            onToggle={() => handleToggle(item.uuid)}
          />
        </div>
      ))}
    </div>
  );
};
