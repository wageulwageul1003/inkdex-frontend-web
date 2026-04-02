'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';

import { Icons } from '@/components/shared/icons';
import { MyProfile } from '@/components/shared/my-profile';
import BookmarkToggle from '@/components/shared/post-toggle/bookmark-toggle';
import FavoriteToggle from '@/components/shared/post-toggle/favorite-toggle';
import { UserProfile } from '@/components/shared/user-profile';
import { IPostListResponse } from '@/hooks/home/useGetPostsList';
import { usePostBookmark } from '@/hooks/posts/bookmark/usePostBookmark';
import { usePostLike } from '@/hooks/posts/like/usePostLike';

interface ICardProps {
  item: IPostListResponse;
  isMyPost?: boolean;
}

export const Card = ({ item, isMyPost = false }: ICardProps) => {
  const router = useRouter();
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // 북마크
  const { mutateAsync: postBookmark } = usePostBookmark();

  // 좋아요
  const { mutateAsync: postLike } = usePostLike();

  const handleBookmark = () => {
    postBookmark({ postUuid: item.uuid });
  };

  const handleLike = () => {
    postLike({ postUuid: item.uuid });
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
      {isMyPost ? (
        <MyProfile
          publicId={item.account.uuid}
          nickname={item.account.nickname}
          nicknameSrc={item.account.profileImageUrl}
          bio={''}
        />
      ) : (
        <UserProfile
          userId={item.account.uuid}
          nickname={item.account.nickname}
          nicknameSrc={item.account.profileImageUrl}
          bio={''}
          following={false}
          isShowMore={true}
          accountUuid={item.account.uuid}
        />
      )}

      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-03">
        <Image
          src={item.imageUrl || '/default-image.png'}
          alt={item.content}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 py-1">
            <FavoriteToggle
              defaultFavorite={item.isLiked}
              onToggle={handleLike}
            />
            <p className="font-xs-2 text-gray-08">{item.likeCount}</p>
          </div>
          <div
            className="flex items-center gap-1 py-1"
            onClick={() => router.push(`/comment/${item.uuid}`)}
          >
            <Icons.messageCircle className="size-6 stroke-gray-05" />
            <p className="font-xs-2 text-gray-08">{item.commentCount}</p>
          </div>
        </div>

        <BookmarkToggle
          defaultBookmark={item.isBookmarked}
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
