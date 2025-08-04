'use client';

import { useRouter } from 'next/navigation';

import PaymentInfo from './payment-info/_components/PaymentInfo';

import { ContentMyPageHeaderDetail } from '@/components/shared/page-headers/ContentMyPageHeader';

export const PaymentHistoryView = () => {
  const router = useRouter();

  return (
    <div className="default-layout-content gap-between-header-footer flex-1">
      <ContentMyPageHeaderDetail
        title={'결제 내역'}
        onClick={() => router.push('/mypage')}
      />
      <PaymentInfo />
    </div>
  );
};
