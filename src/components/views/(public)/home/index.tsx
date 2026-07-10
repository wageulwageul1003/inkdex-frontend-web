'use client';

import React, { useEffect, useState } from 'react';

import { Notification } from '@/components/shared/Notification';
import { Header } from '@/components/shared/layout/header';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { Card } from './_components/Card';
import { Loading } from '@/components/shared/Loading';
import { MyProfile } from '@/components/shared/my-profile';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';
import { IS_TEMP_PASSWORD, TEMP_PASSWORD, USER_UUID } from '@/constants/tokens';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import MainDate from './_components/MainDate';
import { useGetMyPostList } from '@/hooks/mypage/useGetMyPostList';
import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import { useRouter } from 'next/navigation';

const HomeView = () => {
  const router = useRouter();

  const [tempPasswordAlert, setTempPasswordAlert] = useState(false);

  const userId = Cookies.get(USER_UUID);
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
          <MyProfile
            publicId={userId}
            nickname={myProfile?.data?.nickname || ''}
            nicknameSrc={myProfile?.data?.profileImageUrl || ''}
            bio={myProfile?.data?.bio || ''}
            isShowMore={false}
          />
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

      <div className="mt-4 flex flex-col gap-4">
        {data?.content.map((item) => <Card key={item.uuid} item={item} />)}
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
