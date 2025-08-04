import React from 'react';

import { useContent } from '../useContent';

import PaymentFrameItem from './PaymentFrameItem';
import PaymentKitItem from './PaymentKitItem';

import CountLayout from '@/components/shared/CountLayout';
import { Loading } from '@/components/shared/Loading';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import NoData from '@/components/shared/no-data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetPaymentsHistoryList } from '@/hooks/auth/mypage/payments-history/useGetPaymentsHistoryList';
import {
  IPaymentFrameProgram,
  IPaymentKitProgram,
  PaymentProgramType,
} from '@/types/program';

export const renderItemByType = (
  application: PaymentProgramType,
): React.ReactNode => {
  switch (application.type) {
    case 'exhibition':
      return (
        <PaymentFrameItem application={application as IPaymentFrameProgram} />
      );
    case 'reading_kit':
      return <PaymentKitItem application={application as IPaymentKitProgram} />;
    default:
      return null;
  }
};

const PaymentInfo = () => {
  const { tab, onChangeTab, page, pageSize } = useContent();

  const { data: paymentsHistoryData, isLoading } = useGetPaymentsHistoryList({
    page: String(page),
    size: String(pageSize),
    type: tab,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="mt-[64px]">
        <Tabs value={tab} onValueChange={onChangeTab}>
          <TabsList className="no-scrollbar flex overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="whole">전체</TabsTrigger>
            <TabsTrigger value="exhibition">액자전시</TabsTrigger>
            <TabsTrigger value="reading_kit">독서 활동 키트</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-5">
        <CountLayout count={paymentsHistoryData?.data?.page.totalElements} />
      </div>

      {paymentsHistoryData?.data.page.totalElements === 0 ? (
        <NoData />
      ) : (
        <div className="">
          {paymentsHistoryData?.data?.content.map((application, index) => (
            <div
              key={`item-container-${index}`}
              className={
                index !== paymentsHistoryData?.data?.content.length - 1
                  ? 'border-b border-gray-100'
                  : ''
              }
            >
              {renderItemByType(application)}
            </div>
          ))}
        </div>
      )}

      {paymentsHistoryData?.data.page.totalElements > 0 && (
        <div className="mt-[56px]">
          <PaginationWithLinks
            pageSize={pageSize}
            totalCount={paymentsHistoryData?.data?.page.totalElements}
            size={2}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;
