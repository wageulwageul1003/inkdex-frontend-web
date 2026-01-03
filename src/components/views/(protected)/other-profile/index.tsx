'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { useGetOtherProfile } from '@/hooks/auth/other/useGetOtherProfile';
import { useDeleteBlock } from '@/hooks/block/useDeleteBlock';
import { usePostBlock } from '@/hooks/block/usePostBlock';
import { useDeleteFollow } from '@/hooks/follow/useDeleteFollow';
import { usePostFollow } from '@/hooks/follow/usePostFollow';

interface TProps {
  uuid: string;
}

const OtherProfileComponent: FC<TProps> = (props) => {
  const { uuid } = props;
  const router = useRouter();
  const { data } = useGetOtherProfile(uuid);
  const { mutateAsync: postFollow } = usePostFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();
  const { mutateAsync: postBlock } = usePostBlock();
  const { mutateAsync: deleteBlock } = useDeleteBlock();

  const handleBlock = () => {
    if (true) {
      deleteBlock({ publicId: uuid });
    } else {
      postBlock({ publicId: uuid });
    }
  };

  const handleFollow = () => {
    if (true) {
      deleteFollow({ publicId: uuid });
    } else {
      postFollow({ publicId: uuid });
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between py-2">
        <p>프로필</p>
        <Icons.bell className="size-6" onClick={handleBlock} />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col border-b-4 border-gray-200 pb-4 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-gray-300">
              <Image
                src={data?.profileImageUrl || '/default-profile.png'}
                alt="profile-image"
                width={56}
                height={56}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <span className="font-medium">{data?.nickname}</span>

              <div className="flex items-center gap-2">
                <p className="text-black">
                  게시물 <span>{data?.followerCount}</span>
                </p>
                <p className="text-black">
                  팔로워 <span>{data?.followerCount}</span>
                </p>
                <p className="text-black">
                  팔로잉 <span>{data?.followingCount}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleFollow}>팔로우</Button>
    </div>
  );
};

export default OtherProfileComponent;
