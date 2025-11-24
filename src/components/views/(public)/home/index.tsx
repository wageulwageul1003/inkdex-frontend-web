'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Card } from './_components/Card';
import { CategoryFilter } from './_components/CategoryFilter';
import { WriteType } from './_components/WriteType';

import { Loading } from '@/components/shared/Loading';
import { Alaram } from '@/components/shared/alaram';
import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCategoryList } from '@/hook/common/useGetCategoryList';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';
import {
  useGetPostsList,
  IPostListResponse,
} from '@/hook/home/useGetPostsList';
import { IResponsePaged } from '@/types/global';

export const Home = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);

  const { data: categories } = useGetCategoryList();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList({
      category: '',
      size: '10',
      sort: 'createdAt,desc',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="flex flex-1 flex-col bg-white px-4">
      <div className="flex justify-between py-3">
        <span className="font-l-1 text-black">피드</span>
        <Alaram status={true} />
      </div>

      <div>
        <Tabs defaultValue="recommend" className="w-full">
          <TabsList className="">
            <TabsTrigger value="recommend">추천</TabsTrigger>
            <TabsTrigger value="latest">최신</TabsTrigger>
            <TabsTrigger value="follow">팔로우</TabsTrigger>
          </TabsList>

          {/* 추천 */}
          <TabsContent value="recommend">
            <>
              <div className="flex w-full">
                <div className="relative w-full py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200"
                      onClick={() => setOpen(true)}
                    >
                      <Icons.search className="size-3 fill-black" />
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

                  <div className="mt-4 flex flex-col gap-4">
                    {data?.pages?.map(
                      (page: IResponsePaged<IPostListResponse>, i: number) => (
                        <React.Fragment key={i}>
                          {page.data.content.map((item: IPostListResponse) => (
                            <div
                              key={item.publicId}
                              onClick={() =>
                                router.push(`/posts/${item.publicId}`)
                              }
                            >
                              <Card
                                ratio={item.aspectRatio}
                                key={item.publicId}
                                nickname={item.userNickname}
                                viewCounting={item.viewCount}
                                nicknameSrc={item.thumbnailUrl || ''}
                                src={item.thumbnailUrl}
                              />
                            </div>
                          ))}
                        </React.Fragment>
                      ),
                    )}
                    <div ref={observerRef}>
                      {isFetchingNextPage && <Loading />}
                    </div>
                  </div>

                  <div
                    className="fixed bottom-20 left-1/2 z-20 w-full max-w-[360px] -translate-x-1/2 px-4"
                    onClick={() => setWriteOpen(true)}
                  >
                    <div className="flex justify-end">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black shadow-lg">
                        <Icons.search className="size-6 stroke-white" />
                      </div>
                    </div>
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
              <Sheet open={writeOpen} onOpenChange={setWriteOpen}>
                <SheetContent side="bottom">
                  <div className="w-full">
                    <SheetTitle className="pt-7 text-center">
                      <span>글쓰기</span>
                    </SheetTitle>
                  </div>
                  <WriteType />
                </SheetContent>
              </Sheet>
            </>
          </TabsContent>

          {/* 최신 */}
          <TabsContent value="latest"></TabsContent>

          {/* 팔로우 */}
          <TabsContent value="follow"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
