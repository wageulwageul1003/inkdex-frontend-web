'use client';

import Image from 'next/image';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { useGetMyProfile } from '@/hook/auth/useGetMyProfile';

export const MyProfile = () => {
  const { data: myProfile } = useGetMyProfile();
  return (
    <div className="rounded-lg bg-gray-01 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-gray-03">
          <Image
            src={myProfile?.profileImageUrl || '/default-profile.png'}
            alt="profile-image"
            width={56}
            height={56}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="font-medium">{myProfile?.nickname}</span>
          <div className="flex items-center gap-2">
            <p className="text-black">
              팔로워 <span>{myProfile?.followerCount}</span>
            </p>
            <p className="text-black">
              팔로잉 <span>{myProfile?.followingCount}</span>
            </p>
          </div>
        </div>
        <Button variant="buttonIconOutline" size="buttonIconMedium">
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
