'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { NoticeItem } from './NoticeItem';

import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetNoticeCategory } from '@/hooks/notice/useGetNoticeCategory';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { Loading } from '@/components/shared/Loading';
import { useGetNoticeList } from '@/hooks/notice/useGetNoticeList';

export const NoticeView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 카테고리
  const { data: category } = useGetNoticeCategory();

  // "전체" 카테고리를 추가한 카테고리 목록
  const categoryList = useMemo(() => {
    if (!category) return [];

    return [
      {
        label: '전체',
        value: 'all',
      },
      ...category.data.map(({ name, uuid }) => ({
        label: name,
        value: uuid,
      })),
    ];
  }, [category]);

  const initialCategory = searchParams.get('noticeCategoryUuid') || 'all';
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);

  const {
    data: noticeListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNoticeList({
    noticeCategoryUuid: selectedCategory,
    size: '10',
  });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  const handleCategory = (item: string | string[]) => {
    if (typeof item === 'string') {
      setSelectedCategory(item);
      updateUrlParams(item);
    }
  };

  const updateUrlParams = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (item === 'all') {
      params.delete('noticeCategoryUuid');
    } else {
      params.set('noticeCategoryUuid', item);
    }

    router.push(`?${params.toString()}`);
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

      <div className="mt-1">
        <div className="flex gap-2 overflow-x-auto py-2">
          <Chips
            items={categoryList}
            variant="single"
            value={selectedCategory}
            onValueChange={handleCategory}
            type="text"
          />
        </div>

        <div className="mt-3">
          {noticeListData?.paging.totalElements === 0 && (
            <div className="mt-14 flex flex-col items-center gap-[6px]">
              <Icons.moodEmpty className="size-8 fill-gray-03" />
              <span className="font-s-2 text-gray-05">
                등록된 공지사항이 없어요.
              </span>
            </div>
          )}
          <div className="space-y-1">
            {noticeListData?.content.map((item) => (
              <NoticeItem key={item.uuid} item={item} />
            ))}

            <div ref={observerRef} className="flex h-1 justify-center">
              {isFetchingNextPage && <Loading />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
