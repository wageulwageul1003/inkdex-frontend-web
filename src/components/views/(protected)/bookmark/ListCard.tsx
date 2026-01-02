'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';

import { IPostListResponse } from '@/hooks/home/useGetPostsList';
import { useDeletetBookmark } from '@/hooks/posts/bookmark/useDeletetBookmark';
import { usePostBookmark } from '@/hooks/posts/bookmark/usePostBookmark';
import { useDeletetLike } from '@/hooks/posts/like/useDeletetLike';
import { usePostLike } from '@/hooks/posts/like/usePostLike';

export const ListCard = ({ item }: { item: IPostListResponse }) => {
  const router = useRouter();
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // 북마크
  const { mutateAsync: postBookmark } = usePostBookmark();
  const { mutateAsync: deleteBookmark } = useDeletetBookmark();

  // 좋아요
  const { mutateAsync: postLike } = usePostLike();
  const { mutateAsync: deleteLike } = useDeletetLike();

  const handleBookmark = () => {
    if (!item?.bookmarked) {
      postBookmark({ postId: item.id });
    } else {
      deleteBookmark({ postId: item.id });
    }
  };

  const handleLike = () => {
    if (!item.liked) {
      postLike({ postId: item.id });
    } else {
      deleteLike({ postId: item.id });
    }
  };

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkOverflow = () => {
      if (!contentRef.current) return;
      if (expanded) return;
      setShowMore(
        contentRef.current.scrollHeight > contentRef.current.clientHeight + 1,
      );
    };

    checkOverflow();

    const ro = new ResizeObserver(() => {
      checkOverflow();
    });
    ro.observe(el);

    window.addEventListener('resize', checkOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [expanded, item.content]);
  return (
    <div className="h-full w-full rounded-lg border border-gray-03">
      <Image
        src={item.thumbnailUrl || '/default-image.png'}
        alt=""
        width={100}
        height={100}
        style={{ aspectRatio: item.imageMetadata?.aspectRatio }}
        className="h-full w-full rounded-lg border border-gray-03"
      />
    </div>
  );
};
