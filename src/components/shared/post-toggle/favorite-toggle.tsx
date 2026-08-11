import React, { useState, useEffect } from 'react';

import { Icons } from '../icons';

import { usePostLike } from '@/hooks/posts/like/usePostLike';

interface FavoriteToggleProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'icon' | 'onToggle'
  > {
  defaultFavorite?: boolean;
  disabled?: boolean;
  uuid: string;
}

const FavoriteToggle = ({
  defaultFavorite = false,
  disabled,
  uuid,
  ...props
}: FavoriteToggleProps) => {
  const { mutateAsync: postLike } = usePostLike();
  const [isFavorited, setIsFavorited] = useState(defaultFavorite);

  useEffect(() => {
    setIsFavorited(defaultFavorite);
  }, [defaultFavorite]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    await postLike({ postUuid: uuid });

    const newState = !isFavorited;
    setIsFavorited(newState);
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
