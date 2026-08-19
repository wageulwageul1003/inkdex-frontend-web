'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDeleteBlock } from '@/hooks/auth/block/useDeleteBlock';
import { usePostBlock } from '@/hooks/auth/block/usePostBlock';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  accountUuid?: string;
  nickname: string;
  profileImageUrl: string | null;
}

export const BlockUser = ({
  accountUuid,
  nickname,
  profileImageUrl,
}: UserProfileProps) => {
  const [isBlocked, setIsBlocked] = useState(true);

  const { mutateAsync: postBlock } = usePostBlock();
  const { mutateAsync: deleteBlock } = useDeleteBlock();

  const handleBlockToggle = async () => {
    if (!accountUuid) return;

    if (isBlocked) {
      await deleteBlock({
        blockedAccountUuid: accountUuid,
      });

      setIsBlocked(false);
      return;
    }

    await postBlock({
      blockedAccountUuid: accountUuid,
    });

    setIsBlocked(true);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-03">
          <Image
            src={profileImageUrl || '/default-profile.png'}
            alt="profile"
            fill
            className="object-cover"
          />
        </div>

        <span className="font-s-1 text-gray-09">{nickname}</span>
      </div>

      <Button
        onClick={handleBlockToggle}
        size="sm"
        variant="outline"
        className={cn(isBlocked ? 'text-gray-08' : 'text-red-500')}
      >
        {isBlocked ? '차단 해제' : '차단하기'}
      </Button>
    </div>
  );
};
