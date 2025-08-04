'use client';

import { useRouter } from 'next/navigation';

import ApplyInfo from '../mypage/apply-info/ApplyInfo';

import { ContentMyPageHeaderDetail } from '@/components/shared/page-headers/ContentMyPageHeader';

export const ProgramHistoryView = () => {
  const router = useRouter();
  return (
    <div className="default-layout-content gap-between-header-footer flex-1">
      <ContentMyPageHeaderDetail
        title={'프로그램 신청 내역'}
        onClick={() => router.push('/mypage')}
      />
      <ApplyInfo type="history" />
    </div>
  );
};
