'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';

export const MyProfile = () => {
  const { data: myProfile } = useGetMyProfile();
  const router = useRouter();

  return (
    <div className="rounded-lg bg-gray-01 p-4">
      <div className="flex items-center gap-3">
        <div className="relative h-[56px] w-[56px] overflow-hidden rounded-full border border-gray-03">
          <Image
            src={myProfile?.profileImageUrl || '/default-profile.png'}
            alt="profile-image"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <span className="font-medium">{myProfile?.nickname}</span>
          <div className="flex items-center gap-2">
            <p
              className="font-s-2 flex items-center gap-1 text-gray-09"
              onClick={() => router.push('/my/follower')}
            >
              팔로워
              <span className="font-s-1">{myProfile?.followerCount}</span>
            </p>
            <p
              className="font-s-2 flex items-center gap-1 text-gray-09"
              onClick={() => router.push('/my/following')}
            >
              팔로잉
              <span className="font-s-1">{myProfile?.followingCount}</span>
            </p>
          </div>
        </div>
        <Button
          variant="buttonIconOutline"
          size="buttonIconMedium"
          onClick={() => router.push('/edit-profile')}
        >
          <Icons.edit className="size-6" />
        </Button>
      </div>

      {/* bio */}
      <div className="mt-4 px-3 py-2">
        {myProfile?.bio ? (
          <span className="font-xs-2 text-gray-08">{myProfile?.bio}</span>
        ) : (
          <span className="font-xs-2 flex items-center gap-1 text-gray-05">
            <Icons.moodEmpty className="size-4 fill-gray-03" /> 당신의 소개를
            적어보세요.
          </span>
        )}
      </div>
    </div>
  );
};
