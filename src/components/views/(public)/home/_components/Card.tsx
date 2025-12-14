'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';

import { FollowingButton } from '@/components/shared/following-button';
import { Icons } from '@/components/shared/icons';
import BookmarkToggle from '@/components/shared/post-toggle/bookmark-toggle';
import FavoriteToggle from '@/components/shared/post-toggle/favorite-toggle';
import { UserProfile } from '@/components/shared/user-profile';
import { Button } from '@/components/ui/button';
import { IPostListResponse } from '@/hook/home/useGetPostsList';

export const Card = ({ item }: { item: IPostListResponse }) => {
  const router = useRouter();
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <UserProfile
            nickname={item.userNickname}
            nicknameSrc={item.thumbnailUrl || ''}
            bio={item.userBio}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <FollowingButton following={!!item.following} />
          <Button variant="buttonIconTextOnly" size="buttonIconMedium">
            <Icons.moreHoriz className="size-6 fill-gray-08" />
          </Button>
        </div>
      </div>

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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 py-1">
            <FavoriteToggle />
            <p className="font-xs-2 text-gray-08">{item.likeCount}</p>
          </div>
          <div
            className="flex items-center gap-1 py-1"
            onClick={() => router.push(`/comment/${item.id}`)}
          >
            <Icons.messageCircle className="size-6 stroke-gray-05" />
            <p className="font-xs-2 text-gray-08">{item.commentCount}</p>
          </div>
        </div>

        <BookmarkToggle />
      </div>

      <div>
        <p
          ref={contentRef}
          className={`font-s-2 text-black ${expanded ? '' : 'line-clamp-2'}`}
        >
          {item.content}
        </p>

        {showMore && (
          <button
            type="button"
            className="font-xs-2 mt-1 text-gray-08"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? '접기' : '더보기'}
          </button>
        )}

        <div className="flex items-center gap-[2px]">
          {item.tags.map((tag) => (
            <span key={tag} className="font-s-2 text-sand-07">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
