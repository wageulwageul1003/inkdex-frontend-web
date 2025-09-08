import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { useGetMyProfile } from '@/hook/auth/useGetMyProfile';

export const MyIndexComponent = () => {
  const { data: myProfile } = useGetMyProfile();
  console.log(myProfile);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-b-4 border-gray-200 pb-4 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-gray-300">
            <Image
              src={myProfile?.profileImageUrl || '/default-profile.png'}
              alt="profile-image"
              width={56}
              height={56}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="font-medium">{myProfile?.nickname}</span>

            <div className="flex items-center gap-2">
              <p className="text-black">
                게시물 <span>{myProfile?.followerCount}</span>
              </p>
              <p className="text-black">
                팔로워 <span>{myProfile?.followerCount}</span>
              </p>
              <p className="text-black">
                팔로잉 <span>{myProfile?.followingCount}</span>
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="outline">
          프로필 편집
        </Button>
      </div>
    </div>
  );
};
