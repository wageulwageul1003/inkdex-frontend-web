'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { IMyPostResponse } from '@/hooks/mypage/useGetMyPostList';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/icons';
import { useGetEmotionList } from '@/hooks/emotion/useGetEmotionList';
import { useRouter } from 'next/navigation';

interface ICardProps {
  item: IMyPostResponse;
}

export const Card = ({ item }: ICardProps) => {
  const router = useRouter();
  const { data: emotions } = useGetEmotionList();

  const contentRef = useRef<HTMLParagraphElement>(null);

  const [expanded, setExpanded] = useState(false);
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
      className="relative w-full"
      onClick={() => router.push(`/posts/${item.uuid}`)}
    >
      <Icons.folderCard className="absolute inset-0 w-full fill-white" />

      <div className="relative z-10 flex h-full flex-col p-5">
        {/* 출처 */}
        <p className="font-s-1 text-gray-08">{item.source}</p>

        <p>{emotions?.data[0].name} ?? TODO 이거 해야함</p>

        {/* 이미지 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-03">
          <Image
            src={item.imageUrl || '/default-image.png'}
            alt={item.source}
            fill
            className="object-cover"
          />
        </div>

        {/* 내용 */}
        <div className="relative">
          <p
            ref={contentRef}
            className={cn(
              'font-s-2 whitespace-pre-line text-black',
              !expanded && 'line-clamp-2 pr-14',
            )}
          >
            {item.reflection}
          </p>

          {showMore && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="font-xs-2 absolute bottom-0 right-0 bg-white pl-2 text-gray-05"
            >
              {expanded ? '접기' : '...더보기'}
            </button>
          )}
        </div>

        {/* 날짜 */}
        <p className="font-xs-2 text-gray-05">
          {dayjs(item.createdAt).format('YYYY-MM-DD')}
        </p>
      </div>
    </div>
  );
};
