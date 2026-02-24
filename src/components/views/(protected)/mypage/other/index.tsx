'use client';

import { useRouter } from 'next/navigation';

import { MyProfile } from '../_components/MyProfile';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetOtherProfile } from '@/hooks/auth/other/useGetOtherProfile';

interface MyPageProps {
  uuid?: string;
}

export const MyOtherPageView = ({ uuid }: MyPageProps) => {
  const router = useRouter();
  const { data: otherProfile } = useGetOtherProfile(uuid || '');

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <span className="flex items-center">
            <Icons.ArrowBackIos
              className="size-6 fill-gray-08"
              onClick={() => router.back()}
            />
            <span className="font-s-1 text-gray-09">
              {otherProfile?.nickname}
            </span>
          </span>
        }
        right={<Icons.arrowLeftAlt />}
      />
      <MyProfile uuid={uuid} />
    </div>
  );
};
