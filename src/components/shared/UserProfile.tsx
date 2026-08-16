'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '../ui/button';

import { FollowingButton } from './FollowingButton';
import { Icons } from './icons';

import { USER_UUID } from '@/constants/tokens';
import ReportReasonModal from './ReportReasonModal';

interface UserProfileProps {
  accountUuid?: string;
  nickname: string;
  profileImageUrl: string | null;
  bio?: string | null;
  following?: boolean;
  isShowMore?: boolean;
  isShowBio?: boolean;
  postUuid?: string;
}

export const UserProfile = ({
  accountUuid,
  nickname,
  profileImageUrl,
  bio,
  following,
  isShowMore = true,
  isShowBio = true,
  postUuid,
}: UserProfileProps) => {
  const router = useRouter();
  const isMyProfile = accountUuid === Cookies.get(USER_UUID);
  const [moreOpen, setMoreOpen] = useState(false);
  const [reportReasonModalOpen, setReportReasonModalOpen] = useState(false);

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex-1">
        <div className="flex gap-2">
          <div
            className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-03"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isMyProfile) router.push(`/my`);
              else router.push(`/my/${accountUuid}`);
            }}
          >
            <Image
              src={profileImageUrl || '/default-profile.png'}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-s-1 text-gray-09">{nickname}</p>
            {bio && isShowBio && (
              <p className="font-xs-2 text-gray-06">{bio}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!isMyProfile && (
          <div onClick={(e) => e.stopPropagation()}>
            <FollowingButton
              following={!!following}
              accountUuid={accountUuid || ''}
            />
          </div>
        )}
        {isShowMore && !isMyProfile && (
          <div className="relative">
            <Button
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMoreOpen((prev) => !prev);
              }}
            >
              <Icons.moreHoriz className="size-6 fill-gray-08" />
            </Button>

            {moreOpen && (
              <div
                className="absolute right-0 top-full z-30 mt-1 flex h-11 w-[147px] items-center justify-center rounded-lg border border-gray-03 bg-white text-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMoreOpen(false);
                  setReportReasonModalOpen(true);
                }}
              >
                <p className="font-m-2 text-gray-08">게시물 신고하기</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ReportReasonModal
        isOpen={reportReasonModalOpen}
        postUuid={postUuid ?? ''}
      />
    </div>
  );
};
