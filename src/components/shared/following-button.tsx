'use client';

import { Button } from '../ui/button';

import { Icons } from './icons';

interface UserProfileProps {
  following: boolean;
}

export const FollowingButton = ({ following }: UserProfileProps) => {
  return following ? (
    <Button variant="outline" size="sm" className="flex items-center gap-1">
      <Icons.check className="size-4 fill-gray-06" />
      <span className="font-s-2 text-gray-08">팔로잉</span>
    </Button>
  ) : (
    <Button size="sm" variant="outline" className="flex items-center gap-1">
      <Icons.plus className="size-4 fill-gray-06" />
      <span className="font-s-2 text-gray-08">팔로우</span>
    </Button>
  );
};
