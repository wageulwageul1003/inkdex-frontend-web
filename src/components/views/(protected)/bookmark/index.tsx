'use client';

import { useRouter } from 'next/navigation';
import React, { useRef, useEffect } from 'react';

import { DetailCard } from './DetailCard';
import { ListCard } from './ListCard';

import { Loading } from '@/components/shared/Loading';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';
import { useGetPostsList } from '@/hook/home/useGetPostsList';

export const Bookmark = () => {
  const router = useRouter();
  const [mode, setMode] = React.useState<'list' | 'detail'>('list');
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList({
      size: '10',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  useEffect(() => {
    if (mode === 'detail' && detailRefs.current[selectedIndex]) {
      detailRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'instant',
        block: 'start',
      });
    } else if (mode === 'list' && listRefs.current[selectedIndex]) {
      listRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
    }
  }, [mode, selectedIndex]);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
    setMode('detail');
  };

  return (
    <div className="w-full">
      <div className="mt-4 flex flex-col gap-4">
        {mode === 'list' ? (
          <div className="grid grid-cols-3 gap-1">
            {data?.content.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => {
                  listRefs.current[index] = el;
                }}
                onClick={() => handleListItemClick(index)}
                className="cursor-pointer"
              >
                <ListCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {data?.content.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => {
                  detailRefs.current[index] = el;
                }}
                className="min-h-screen w-full"
              >
                <DetailCard item={item} onClick={() => setMode('list')} />
              </div>
            ))}
          </div>
        )}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
    </div>
  );
};
