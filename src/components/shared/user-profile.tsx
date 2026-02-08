'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '../ui/button';

import { CustomAlertDialog } from './custom-alert-dialog';
import { FollowingButton } from './following-button';
import { Icons } from './icons';

import { USER_ID } from '@/constants/tokens';
import { usePostReport } from '@/hooks/report/usePostReport';

interface UserProfileProps {
  userId?: string;
  publicId?: string;
  nickname: string;
  nicknameSrc: string;
  bio?: string;
  following?: boolean;
  isShowMore?: boolean;
}

export const UserProfile = ({
  userId,
  publicId,
  nickname,
  nicknameSrc,
  bio,
  following,
  isShowMore = true,
}: UserProfileProps) => {
  const router = useRouter();
  const isMyProfile = userId === Cookies.get(USER_ID);
  const [reportAlertOpen, setReportAlertOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { mutateAsync: postReport } = usePostReport();

  const handleReport = () => {
    setMoreOpen(false);
    setReportAlertOpen(false);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex-1">
        <div className="flex gap-2">
          <div
            className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-03"
            onClick={() => {
              if (isMyProfile) router.push(`/my`);
              else router.push(`/my/${userId}`);
            }}
          >
            <Image
              src={nicknameSrc || '/default-profile.png'}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-s-1 text-gray-09">{nickname}</p>
            {bio && <p className="font-xs-2 text-gray-06">{bio}</p>}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!isMyProfile && (
          <FollowingButton following={!!following} publicId={publicId || ''} />
        )}
        {isShowMore && !isMyProfile && (
          <div className="relative">
            <Button
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
              onClick={() => setMoreOpen((prev) => !prev)}
            >
              <Icons.moreHoriz className="size-6 fill-gray-08" />
            </Button>

            {moreOpen && (
              <div
                className="absolute right-0 top-full z-10 mt-1 flex h-11 w-[147px] items-center justify-center rounded-lg border border-gray-03 bg-white text-center"
                onClick={handleReport}
              >
                <p className="font-m-2 text-gray-08">게시물 신고하기</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CustomAlertDialog
        isOpen={reportAlertOpen}
        onOpenChange={setReportAlertOpen}
        title="게시물을 신고할까요?"
        description="신고한 게시물은 운영 정책에 따라 검토됩니다. <br />신고 후에는 취소할 수 없어요."
        cancelText="닫기"
        confirmText="신고하기"
        onConfirm={() => {
          postReport({
            targetId: publicId || '',
            targetType: 'POST',
            reason: 'SPAM',
          });
        }}
      />
    </div>
  );
};
