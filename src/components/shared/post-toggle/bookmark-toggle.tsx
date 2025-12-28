import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Icons } from '../icons';

import { useAuth } from '@/providers/auth';

interface BookmarToggleProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'icon' | 'onToggle'
  > {
  defaultBookmark?: boolean;
  disabled?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

const BookmarkToggle = ({
  defaultBookmark = false,
  disabled,
  onToggle,
  ...props
}: BookmarToggleProps) => {
  // const { mutateAsync: postWish } = usePostWish();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  // const alert = useAlert();
  const [isBookmarked, setIsBookmarked] = useState(defaultBookmark);

  // Update state when defaultFavorite prop changes (e.g., when data loads)
  useEffect(() => {
    setIsBookmarked(defaultBookmark);
  }, [defaultBookmark]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    if (!isLoggedIn) {
      alert({
        icon: 'info',
        title: '로그인 후 이용하실 수 있습니다.',
        cancelText: '닫기',
        cancelButton: {
          className: 'w-full',
        },
        confirmText: '로그인',
        onConfirm: () => {
          router.push('/login');
        },
      });
      return;
    }

    const newState = !isBookmarked;
    setIsBookmarked(newState);

    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <span
      onClick={handleToggle}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
      {...props}
    >
      {isBookmarked ? (
        <Icons.bookmark_fill className={`size-6 fill-sand-07`} />
      ) : (
        <Icons.bookmark className={`size-6 stroke-gray-05`} />
      )}
    </span>
  );
};

export default BookmarkToggle;
