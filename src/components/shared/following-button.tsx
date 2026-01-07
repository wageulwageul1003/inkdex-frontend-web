'use client';

import { Button } from '../ui/button';

import { Icons } from './icons';

import { useDeleteFollow } from '@/hooks/follow/useDeleteFollow';
import { usePostFollow } from '@/hooks/follow/usePostFollow';

interface UserProfileProps {
  following: boolean;
  publicId: string;
}

export const FollowingButton = ({ following, publicId }: UserProfileProps) => {
  const { mutateAsync: postFollow } = usePostFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  return following ? (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={() => deleteFollow({ publicId })}
    >
      <Icons.check className="size-4 fill-gray-06" />
      <span className="font-s-2 text-gray-08">팔로잉</span>
    </Button>
  ) : (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-1"
      onClick={() => postFollow({ publicId })}
    >
      <Icons.plus className="size-4 fill-gray-06" />
      <span className="font-s-2 text-gray-08">팔로우</span>
    </Button>
  );
};
