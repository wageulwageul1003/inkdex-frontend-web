'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { CurrentPoint } from './current-point/CurrentPoint';
import { PointHistoryItem } from './point-history/PointHistory';
import { useContent } from './useContent';

import CountLayout from '@/components/shared/CountLayout';
import { Loading } from '@/components/shared/Loading';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import NoData from '@/components/shared/no-data';
import { ContentMyPageHeaderDetail } from '@/components/shared/page-headers/ContentMyPageHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyPoint } from '@/hooks/auth/point/useGetMyPoint';
import { useGetMyPointHistoryList } from '@/hooks/auth/point/useGetMyPointHistoryList';
import { useSpecificConstant } from '@/hooks/useGetConstant';

const MyPointsView = () => {
  const { tab, onChangeTab, page, pageSize } = useContent();
  const router = useRouter();

  const { data: pointData, isLoading } = useGetMyPointHistoryList({
    constPointType: tab,
    page: String(page),
    size: String(pageSize),
  });

  const { data: myPointData } = useGetMyPoint();

  const { constants: pointType } = useSpecificConstant('const_point_type');

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="default-layout-content">
      <ContentMyPageHeaderDetail
        title={'나의 씨앗 현황'}
        onClick={() => router.push('/mypage')}
      />

      <div className="mt-[64px]">
        <CurrentPoint
          nickname={myPointData?.nickName || ''}
          count={myPointData?.currentPoint || 0}
        />
      </div>

      <div className="mt-[40px]">
        <Tabs value={tab} onValueChange={onChangeTab}>
          <TabsList className="no-scrollbar flex overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="whole">전체</TabsTrigger>
            {pointType.map((item) => (
              <TabsTrigger key={String(item.value)} value={String(item.value)}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-5">
        <CountLayout count={pointData?.data.page.totalElements} />
      </div>

      {pointData?.data.page.totalElements === 0 ? (
        <NoData />
      ) : (
        <div>
          {pointData?.data.content.map((item, index) => (
            <div
              key={index}
              className={
                index === pointData.data.content.length - 1
                  ? ''
                  : 'border-b border-gray-200'
              }
            >
              <div className="flex gap-2">
                <PointHistoryItem
                  content={item.paymentReason}
                  date={item.createdAt}
                  count={item.pointAmount}
                  type={item.constPointType}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {pointData?.data.page.totalElements > 0 && (
        <div className="mt-[56px]">
          <PaginationWithLinks
            pageSize={pageSize}
            totalCount={pointData?.data.page.totalElements}
            size={2}
          />
        </div>
      )}
    </div>
  );
};

export default MyPointsView;
