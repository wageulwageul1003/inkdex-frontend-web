'use client';

import Image from 'next/image';

import { UserProfile } from '@/components/shared/user-profile';

interface CardProps {
  nickname: string;
  viewCounting: number;
  nicknameSrc: string;
  src: string;
  ratio: number;
}

export const Card = ({
  nickname,
  viewCounting,
  nicknameSrc,
  src,
  ratio = 1.5,
}: CardProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Image
        src={src || '/default-image.png'}
        alt=""
        width={100}
        height={100}
        className="w-full rounded-[24px]"
        style={{ aspectRatio: ratio }}
      />

      <div className="flex items-center justify-between">
        <UserProfile nickname={nickname} nicknameSrc={nicknameSrc} />
        <p className="text-blue-09">조회 {viewCounting}</p>
      </div>
    </div>
  );
};
