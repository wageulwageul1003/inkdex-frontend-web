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
import { useDeletetBookmark } from '@/hook/posts/bookmark/useDeletetBookmark';
import { usePostBookmark } from '@/hook/posts/bookmark/usePostBookmark';
import { useDeletetLike } from '@/hook/posts/like/useDeletetLike';
import { usePostLike } from '@/hook/posts/like/usePostLike';

export const Card = ({ item }: { item: IPostListResponse }) => {
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
            <FavoriteToggle
              defaultFavorite={item.liked}
              onToggle={handleLike}
            />
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

        <BookmarkToggle
          defaultBookmark={item.bookmarked}
          onToggle={handleBookmark}
        />
      </div>

      <div>
        <div className="relative">
          <p
            ref={contentRef}
            className={`font-s-2 whitespace-pre-line text-black ${expanded ? '' : 'line-clamp-2'} ${showMore && !expanded ? 'pr-10' : ''}`}
          >
            {item.content}
          </p>

          {showMore && !expanded && (
            <button
              type="button"
              className="font-xs-2 absolute bottom-0 right-0 bg-white pl-3 text-gray-05"
              onClick={() => setExpanded((prev) => !prev)}
            >
              ...더보기
            </button>
          )}
        </div>

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
