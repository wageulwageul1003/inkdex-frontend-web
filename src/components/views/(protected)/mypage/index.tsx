'use client';

import { useRouter } from 'next/navigation';

import MyHeader from './_components/MyHeader';
import { MyProfile } from './_components/MyProfile';
import { Summary } from './_components/Summary';

import { Alaram } from '@/components/shared/alaram';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';

const MyPageMenu = [
  { value: 'my-index', label: '나의 인덱스' },
  { value: 'statistics', label: '통계' },
  { value: 'activity', label: '활동' },
];

const MyPageComponent = () => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={<span className="font-l-1 text-black">마이페이지</span>}
        right={
          <span className="flex items-center gap-2">
            <Alaram status={true} />
            <Button
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
              onClick={() => router.push('/preferences')}
            >
              <Icons.settings className="size-6 fill-gray-08" />
            </Button>
          </span>
        }
      />

      <div className="mt-3 flex flex-1 flex-col">
        <MyProfile />
        <Summary />

        <div className="flex flex-col gap-4">
          <MyHeader title="북마크" onClick={() => router.push('/bookmark')} />
          <MyHeader
            title="관심 있는 카테고리"
            onClick={() => router.push('/favorite-categories')}
          />
        </div>
      </div>
    </div>
  );
};

export default MyPageComponent;
