'use client';

import { Button } from '@/components/ui/button';
import { usePostBlock } from '@/hooks/auth/block/usePostBlock';
import Image from 'next/image';

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
  const { mutateAsync: postBlock } = usePostBlock();

  const handleBlock = async () => {
    await postBlock({ blockedAccountUuid: accountUuid ?? '' });
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex-1">
        <div className="flex gap-2">
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

        <Button onClick={() => handleBlock()}>차단</Button>
      </div>
    </div>
  );
};
