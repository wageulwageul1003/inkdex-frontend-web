'use client';

import React, { useState } from 'react';

import { Notification } from '@/components/shared/Notification';
import { Header } from '@/components/shared/layout/header';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';
import { Card } from './_components/Card';
import { Loading } from '@/components/shared/Loading';
import { MyProfile } from '@/components/shared/my-profile';
import { useGetMyProfile } from '@/hooks/auth/useGetMyProfile';
import { USER_UUID } from '@/constants/tokens';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import MainDate from './_components/MainDate';
import { useGetMyPostList } from '@/hooks/mypage/useGetMyPostList';

const HomeView = () => {
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
    </div>
  );
};

export { HomeView };
