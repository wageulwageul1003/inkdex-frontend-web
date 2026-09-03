'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { Icons } from '@/components/shared/icons';
import { IMyPostResponse } from '@/hooks/mypage/useGetMyPostList';

interface IHomeCardProps {
  item: IMyPostResponse;
}

export const HomeCard = ({ item }: IHomeCardProps) => {
  const router = useRouter();

  const contentRef = useRef<HTMLParagraphElement>(null);

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) return;

    const checkOverflow = () => {
      setShowMore(element.scrollHeight > element.clientHeight);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [item.reflection]);

  return (
    <div
      className="relative flex h-[448px] w-full cursor-pointer flex-col overflow-hidden rounded-md"
      onClick={() => router.push(`/posts/${item.uuid}`)}
      onKeyDown={(event) => {
        if (event.currentTarget === event.target && event.key === 'Enter') {
          router.push(`/posts/${item.uuid}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <Icons.folderCard
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[448px] w-full fill-white"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[440px] bg-white"
      />

      {/* 출처 */}
      <p className="font-s-1 relative mx-3 mt-2 w-56 shrink-0 truncate text-gray-08">
        {item.source}
      </p>

      <div className="relative mx-2 mt-3 aspect-square shrink-0 overflow-hidden rounded-lg border border-gray-03">
        <Image
          src={item.imageUrl || '/default-image.png'}
          alt={item.source}
          fill
          className="object-cover"
        />

        {item.emotion && (
          <div className="font-xs-2 absolute left-2 top-2 z-10 flex items-center justify-center rounded-lg bg-black/20 px-2 py-1 text-white">
            {item.emotion.name}
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="relative mx-3 mt-3">
        <p
          ref={contentRef}
          className="font-s-2 line-clamp-2 whitespace-pre-line text-gray-08"
        >
          {item.reflection}
        </p>

        {showMore && (
          <span
            aria-hidden="true"
            className="font-xs-2 absolute bottom-0 right-0 bg-white pl-3 text-gray-05"
          >
            더보기
          </span>
        )}
      </div>

      {/* 날짜 */}
      <p className="font-xs-2 relative mx-3 mb-4 mt-3 text-gray-05">
        {dayjs(item.createdAt).format('YYYY-MM-DD')}
      </p>
    </div>
  );
};
