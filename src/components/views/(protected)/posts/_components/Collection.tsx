import { useRouter } from 'next/navigation';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
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
import {
  ICollectionListResponse,
  useGetCollectionList,
} from '@/hook/collection/useGetCollectionList';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';
import { IResponsePaged } from '@/types/global';

export const Collection = () => {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCollectionList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex w-full items-center justify-center gap-1"
        >
          <Icons.plus className="size-6 fill-gray-06" />
          <span className="font-m-2">컬렉션에 담기</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>담고싶은 컬렉션을 선택해주세요</DrawerTitle>
        </DrawerHeader>

        <div className="mt-7 px-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-01 py-2 pl-3 pr-4">
            <div
              className="flex items-center gap-3"
              onClick={() => router.push('/collection/write')}
            >
              <Icons.plus className="size-6 fill-gray-06" />
              <span className="font-s-2 text-gray-09">새로 만들기</span>
            </div>
            <Icons.keyboardArrowRight className="size-6 fill-gray-06" />
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {data?.pages?.map(
              (page: IResponsePaged<ICollectionListResponse>, i: number) => (
                <React.Fragment key={i}>
                  {page.data.content.map((item: ICollectionListResponse) => (
                    <div key={item.uuid}>{item.name}</div>
                  ))}
                </React.Fragment>
              ),
            )}
            <div ref={observerRef}>{isFetchingNextPage && <Loading />}</div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild></DrawerClose>
          <Button>담기</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
