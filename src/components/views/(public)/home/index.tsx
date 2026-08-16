'use client';

import React, { useEffect, useState } from 'react';

import { Notification } from '@/components/shared/Notification';
import { Header } from '@/components/shared/layout/header';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { HomeCard } from './_components/HomeCard';
import { Loading } from '@/components/shared/Loading';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';
import { IS_TEMP_PASSWORD, TEMP_PASSWORD } from '@/constants/tokens';
import dayjs from 'dayjs';
import MainDate from './_components/MainDate';
import { useGetMyPostList } from '@/hooks/mypage/useGetMyPostList';
import { CustomAlertDialog } from '@/components/shared/CustomAlertDialog';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const HomeView = () => {
  const router = useRouter();

  const [tempPasswordAlert, setTempPasswordAlert] = useState(false);

  const { data: myProfile } = useGetMyProfile();
  const [selectedYear, setSelectedYear] = useState(
    dayjs(new Date()).format('YYYY'),
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMyPostList({
      size: '3',
      year: selectedYear,
      month: selectedMonth,
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  useEffect(() => {
    if (sessionStorage.getItem(IS_TEMP_PASSWORD) === 'true') {
      setTempPasswordAlert(true);
      sessionStorage.removeItem(IS_TEMP_PASSWORD);
    }
  });

  return (
    <div className="w-full bg-gray-02 px-4">
      <Header
        left={
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-03">
                <Image
                  src={
                    myProfile?.data.profileImageUrl || '/default-profile.png'
                  }
                  alt="profile"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <p className="font-s-1 text-gray-09">
                  {myProfile?.data.nickname}
                </p>
                {myProfile?.data.bio && (
                  <p className="font-xs-2 text-gray-06">
                    {myProfile?.data.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        }
        right={<Notification />}
        className="bg-gray-02"
      />

      <MainDate
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        total={data?.paging.totalElements || 0}
      />

      <div className="mb-20 mt-4 flex flex-col gap-4">
        {data?.content.map((item) => <HomeCard key={item.uuid} item={item} />)}
        <div ref={observerRef} className="flex h-1 justify-center">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>

      <CustomAlertDialog
        isOpen={tempPasswordAlert}
        onOpenChange={setTempPasswordAlert}
        title="비밀번호를 변경해주세요"
        description={
          <>
            임시 비밀번호로 로그인했어요.
            <br />
            안전을 위해 비밀번호를 변경해주세요.
          </>
        }
        confirmText="비밀번호 변경하기"
        isCancelShow={false}
        onConfirm={() =>
          router.push(
            `/preferences/account/current-password/reset?currentPassword=${sessionStorage.getItem(TEMP_PASSWORD)}`,
          )
        }
      />
    </div>
  );
};

export { HomeView };
