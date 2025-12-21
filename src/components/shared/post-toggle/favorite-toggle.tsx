import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Icons } from '../icons';

import { useAuth } from '@/providers/auth';

interface FavoriteToggleProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'icon' | 'onToggle'
  > {
  defaultFavorite?: boolean;
  iconClassName?: string;
  className?: string;
  disabled?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

const FavoriteToggle = ({
  defaultFavorite = false,
  disabled,
  onToggle,
  ...props
}: FavoriteToggleProps) => {
  // const { mutateAsync: postWish } = usePostWish();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  // const alert = useAlert();
  const [isFavorited, setIsFavorited] = useState(defaultFavorite);

  // Update state when defaultFavorite prop changes (e.g., when data loads)
  useEffect(() => {
    setIsFavorited(defaultFavorite);
  }, [defaultFavorite]);

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

    const newState = !isFavorited;
    setIsFavorited(newState);

    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <span
      onClick={handleToggle}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      {...props}
    >
      {isFavorited ? (
        <Icons.heart_filled className={`size-6 fill-red-05`} />
      ) : (
        <Icons.heart className={`size-6 stroke-gray-05`} />
      )}
    </span>
  );
};

export default FavoriteToggle;
