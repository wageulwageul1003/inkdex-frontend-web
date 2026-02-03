'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '../ui/button';
import { toast } from '../ui/sonner';

import { CustomAlertDialog } from './custom-alert-dialog';
import { Icons } from './icons';

import { useDeletePosts } from '@/hooks/posts/useDeletePosts';

interface MyProfileProps {
  publicId?: string;
  nickname: string;
  nicknameSrc: string;
  bio?: string;
}

export const MyProfile = ({
  publicId,
  nickname,
  nicknameSrc,
  bio,
}: MyProfileProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { mutateAsync: deletePosts } = useDeletePosts({ publicId: publicId });

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex-1">
        <div className="flex gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-03">
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
        <div className="relative">
          <Button
            variant="buttonIconTextOnly"
            size="buttonIconMedium"
            onClick={() => setMoreOpen((prev) => !prev)}
          >
            <Icons.moreHoriz className="size-6 fill-gray-08" />
          </Button>

          {moreOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 flex h-[92px] w-[70px] flex-col items-center justify-center gap-1 rounded-lg border border-gray-03 bg-white text-center">
              <div className="px-3 py-2">
                <p className="font-m-2 text-gray-08">편집</p>
              </div>
              <div
                className="px-3 py-2"
                onClick={() => setDeleteAlertOpen(true)}
              >
                <p className="font-m-2 text-red-05">삭제</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CustomAlertDialog
        isOpen={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        title="이 게시물을 삭제할까요?"
        description="삭제 후에는 복구할 수 없어요."
        cancelText="아니오"
        confirmText="예"
        onConfirm={() => {
          deletePosts({ publicId: publicId || '' }).then(() => {
            setDeleteAlertOpen(false);
            toast.success('게시물 삭제가 완료되었어요.');
          });
        }}
      />
    </div>
  );
};
