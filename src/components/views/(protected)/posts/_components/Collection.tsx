import Image from 'next/image';
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
import { useGetCollectionList } from '@/hook/collection/useGetCollectionList';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';
import { cn } from '@/lib/utils';

interface TProps {
  selectedCollections: string[];
  setSelectedCollections: (collections: string[]) => void;
}

export const Collection = (props: TProps) => {
  const { selectedCollections, setSelectedCollections } = props;
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
      <DrawerContent className="flex max-h-[624px] flex-col">
        <DrawerHeader>
          <DrawerTitle>담고싶은 컬렉션을 선택해주세요</DrawerTitle>
        </DrawerHeader>

        <div className="mt-7 flex-1 overflow-y-auto px-4 pb-5">
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
            {data?.content.map((item) =>
              (() => {
                const isSelected = selectedCollections.includes(
                  item.collectionId,
                );

                const toggle = () => {
                  setSelectedCollections(
                    isSelected
                      ? selectedCollections.filter(
                          (id) => id !== item.collectionId,
                        )
                      : [...selectedCollections, item.collectionId],
                  );
                };

                return (
                  <div
                    key={item.collectionId}
                    className="flex items-center gap-3 rounded-lg bg-gray-01 py-2 pl-3 pr-4"
                    onClick={toggle}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') toggle();
                    }}
                  >
                    <div className="h-[40px] w-[40px] shrink-0 rounded-md border border-gray-03">
                      <Image
                        src={item.thumbnailUrl}
                        alt=""
                        width={40}
                        height={40}
                      />
                    </div>
                    <span className="font-s-2 line-clamp-1 flex-1 text-gray-09">
                      {item.name}
                    </span>
                    {isSelected ? (
                      <Icons.checkBox className={cn('size-6 fill-gray-08')} />
                    ) : (
                      <Icons.checkBoxOutlineBlank
                        className={cn('size-6 stroke-gray-05')}
                      />
                    )}
                  </div>
                );
              })(),
            )}
            <div ref={observerRef} className="flex h-1 justify-center">
              {isFetchingNextPage && <Loading />}
            </div>
          </div>
        </div>

        <DrawerFooter className="sticky bottom-3 z-10 bg-white px-4">
          <DrawerClose asChild>
            <Button variant="contained" size="lg">
              저장
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
