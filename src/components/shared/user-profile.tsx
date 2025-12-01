'use client';

import Image from 'next/image';

interface UserProfileProps {
  nickname: string;
  nicknameSrc: string;
  bio?: string;
}

export const UserProfile = ({
  nickname,
  nicknameSrc,
  bio,
}: UserProfileProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-03">
        <Image
          src={nicknameSrc || '/default-profile.png'}
          alt=""
          width={16}
          height={16}
        />
      </div>
      <div className="flex flex-col">
        <p className="font-s-1 text-gray-09">{nickname}</p>
        {bio && <p className="font-xs-2 text-gray-06">{bio}</p>}
      </div>
    </div>
  );
};
