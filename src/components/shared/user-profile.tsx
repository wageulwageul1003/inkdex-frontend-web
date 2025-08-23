'use client';

import Image from 'next/image';

interface UserProfileProps {
  nickname: string;
  nicknameSrc: string;
}

export const UserProfile = ({ nickname, nicknameSrc }: UserProfileProps) => {
  return (
    <div className="flex gap-[6px]">
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400">
        <Image
          src={nicknameSrc || '/default-profile.png'}
          alt=""
          width={16}
          height={16}
        />
      </div>
      <p className="text-gray-700">{nickname}</p>
    </div>
  );
};
