'use client';

import Image from 'next/image';

interface CardProps {
  nickname: string;
  viewCounting: number;
  nicknameSrc: string;
  src: string;
}

export const Card = ({
  nickname,
  viewCounting,
  nicknameSrc,
  src,
}: CardProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Image
        src={'/default-image.png'}
        alt=""
        width={100}
        height={100}
        className="w-full rounded-[24px]"
      />

      <div className="flex items-center justify-between">
        <div className="flex gap-[6px]">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400">
            <Image src={'/default-profile.png'} alt="" width={16} height={16} />
          </div>
          <p className="text-gray-700">{nickname}</p>
        </div>
        <p className="text-gray-500">조회 {viewCounting}</p>
      </div>
    </div>
  );
};
