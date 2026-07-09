'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { useGetOtherProfile } from '@/hooks/auth/other/useGetOtherProfile';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';
import { usePostFollow } from '@/hooks/follow/usePostFollow';
import { FollowingCancel } from './FollowingCancel';

interface MyProfileProps {
  uuid?: string;
}

export const MyProfile = ({ uuid }: MyProfileProps) => {
  const router = useRouter();
  const isMyProfile = !uuid;
  const [isShowFollowingCancel, setIsShowFollowingCancel] = useState(false);
  const { data: myProfile } = useGetMyProfile(isMyProfile);
  const { data: otherProfile } = useGetOtherProfile(uuid || '');
  const { mutateAsync: postFollow } = usePostFollow();

  const [isFollowing, setIsFollowing] = useState(
    otherProfile?.data.isFollowing,
  );

  const handleToggleFollow = async () => {
    const prev = isFollowing;
    const next = !prev;

    setIsFollowing(next);

    if (uuid) {
      try {
        if (next) {
          await postFollow(uuid);
        } else {
          setIsShowFollowingCancel(true);
        }
      } catch {
        setIsFollowing(prev);
      }
    }
  };

  return (
    <div className="rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="relative h-[56px] w-[56px] overflow-hidden rounded-full border border-gray-03">
          <Image
            src={myProfile?.data.profileImageUrl || '/default-profile.png'}
            alt="profile-image"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <span className="font-s-1 text-gray-09">
            {isMyProfile
              ? myProfile?.data.nickname
              : otherProfile?.data.nickname}
          </span>
          {isMyProfile ? (
            <div className="flex items-center gap-2">
              <p
                className="font-s-2 flex items-center gap-1 text-gray-09"
                onClick={() => router.push('/my/follower')}
              >
                팔로워
                <span className="font-s-1">
                  {myProfile?.data.followerCount}
                </span>
              </p>
              <p
                className="font-s-2 flex items-center gap-1 text-gray-09"
                onClick={() => router.push('/my/following')}
              >
                팔로잉
                <span className="font-s-1">
                  {myProfile?.data.followingCount}
                </span>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-s-2 flex items-center gap-1 text-gray-09">
                팔로워
                <span className="font-s-1">
                  {otherProfile?.data.followerCount}
                </span>
              </p>
              <p className="font-s-2 flex items-center gap-1 text-gray-09">
                팔로잉
                <span className="font-s-1">
                  {otherProfile?.data.followingCount}
                </span>
              </p>
            </div>
          )}
        </div>
        {isMyProfile && (
          <Button
            variant="buttonIconOutline"
            size="buttonIconMedium"
            onClick={() => router.push('/edit-profile')}
          >
            <Icons.edit className="size-6" />
          </Button>
        )}
      </div>

      <div className="mt-4 px-3 py-2">
        {isMyProfile ? (
          myProfile?.data.bio ? (
            <span className="font-xs-2 text-gray-08">
              {myProfile?.data.bio}
            </span>
          ) : (
            <span className="font-xs-2 flex items-center gap-1 text-gray-05">
              <Icons.moodEmpty className="size-4 fill-gray-03" /> 당신의 소개를
              적어보세요.
            </span>
          )
        ) : (
          <span className="font-xs-2 text-gray-08">
            {otherProfile?.data.bio ?? '소개가 없습니다.'}
          </span>
        )}
      </div>

      <div className="mt-4 w-full">
        {!isMyProfile &&
          (isFollowing ? (
            <FollowingCancel
              uuid={uuid!}
              isShowFollowingCancel={isShowFollowingCancel}
              setIsShowFollowingCancel={setIsShowFollowingCancel}
              onSuccess={() => setIsFollowing(false)}
            />
          ) : (
            <Button
              variant="contained"
              size="md"
              onClick={handleToggleFollow}
              className="w-full"
            >
              <span className="font-m-2 text-white">팔로우</span>
            </Button>
          ))}
      </div>
    </div>
  );
};
