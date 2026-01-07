'use client';

import Image from 'next/image';

import { Button } from '../ui/button';

import { FollowingButton } from './following-button';
import { Icons } from './icons';

interface UserProfileProps {
  publicId?: string;
  nickname: string;
  nicknameSrc: string;
  bio?: string;
  following?: boolean;
  isShowMore?: boolean;
}

export const UserProfile = ({
  publicId,
  nickname,
  nicknameSrc,
  bio,
  following,
  isShowMore = true,
}: UserProfileProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="flex gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-03">
            <Image
              src={nicknameSrc || '/default-profile.png'}
              alt=""
              width={16}
              height={16}
            />
          </div>
          <div className="flex flex-col">
            <p className="font-s-1 text-gray-09">{nickname}</p>
            {bio && <p className="font-xs-2 text-gray-06">{bio}</p>}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <FollowingButton following={!!following} publicId={publicId || ''} />
        {isShowMore && (
          <Button variant="buttonIconTextOnly" size="buttonIconMedium">
            <Icons.moreHoriz className="size-6 fill-gray-08" />
          </Button>
        )}
      </div>
    </div>
  );
};
