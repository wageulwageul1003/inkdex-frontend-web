'use client';

import Image from 'next/image';

import FavoriteToggle from '@/components/shared/favorite-toggle';
import { FollowingButton } from '@/components/shared/following-button';
import { Icons } from '@/components/shared/icons';
import { UserProfile } from '@/components/shared/user-profile';
import { Button } from '@/components/ui/button';

interface CardProps {
  following?: boolean;
  nickname: string;
  bio: string;
  viewCounting: number;
  commentCounting?: number;
  nicknameSrc: string;
  src: string;
  ratio: number;
}

export const Card = ({
  following,
  nickname,
  bio,
  viewCounting,
  commentCounting,
  nicknameSrc,
  src,
  ratio = 1.5,
}: CardProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <UserProfile
            nickname={nickname}
            nicknameSrc={nicknameSrc}
            bio={bio}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <FollowingButton following={!!following} />
          <Button variant="buttonIconTextOnly" size="buttonIconMedium">
            <Icons.moreHoriz className="size-6 fill-gray-08" />
          </Button>
        </div>
      </div>

      <div className="h-full w-full rounded-lg border border-gray-03">
        <Image
          src={src || '/default-image.png'}
          alt=""
          width={100}
          height={100}
          style={{ aspectRatio: ratio }}
          className="h-full w-full rounded-lg border border-gray-03"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 py-1">
            <FavoriteToggle />
            <p className="font-xs-2 text-gray-08">{viewCounting}</p>
          </div>
          <div className="flex items-center gap-1 py-1">
            <Icons.messageCircle className="size-6 stroke-gray-05" />
            <p className="font-xs-2 text-gray-08">{commentCounting}</p>
          </div>
        </div>

        <Button variant="buttonIconTextOnly" size="buttonIconMedium">
          <Icons.moreHoriz className="size-6 fill-gray-08" />
        </Button>
      </div>

      <p>content</p>
    </div>
  );
};
