'use client';

import { useEffect, useState } from 'react';

import { Button } from '../ui/button';

import { Icons } from './icons';

import { useDeleteFollow } from '@/hooks/follow/useDeleteFollow';
import { usePostFollow } from '@/hooks/follow/usePostFollow';

interface UserProfileProps {
  following: boolean;
  accountUuid: string;
}

export const FollowingButton = ({
  following,
  accountUuid,
}: UserProfileProps) => {
  const { mutateAsync: postFollow } = usePostFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  const [isFollowing, setIsFollowing] = useState(following);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const handleToggleFollow = async () => {
    const prev = isFollowing;
    const next = !prev;

    setIsFollowing(next);

    try {
      if (next) {
        await postFollow(accountUuid);
      } else {
        await deleteFollow(accountUuid);
      }
    } catch {
      setIsFollowing(prev);
    }
  };

  return isFollowing ? (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={handleToggleFollow}
    >
      <Icons.check className="size-4 fill-gray-06" />
      <span className="font-s-2 text-gray-08">팔로잉</span>
    </Button>
  ) : (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-1"
      onClick={handleToggleFollow}
    >
      <Icons.plus className="size-4 fill-gray-06" />
      <span className="font-s-2 text-gray-08">팔로우</span>
    </Button>
  );
};
