'use client';

import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

import {
  ContentMyPageHeaderDetail,
  MyPageHeaderInfoTitle,
} from '../../../../shared/page-headers/ContentMyPageHeader';
import ApplyItem from '../_component/ApplyItem';
import DocumentItem from '../_component/DocumentItem';
import PriceItem from '../_component/PriceItem';
import PublisherItem from '../_component/PublisherItem';
import ShippingItem from '../_component/ShippingItem';
import TuningItem from '../_component/TuningItem';

import FrameItem from './_components/FrameItem';

import CButton from '@/components/shared/CButton';
import { useGetProgramApplicationFrameDetail } from '@/hooks/program/application/useGetProgramApplicationFrameDetail';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

interface TProps {
  uuid: string;
}

export const FrameDetailItemView: FC<TProps> = (props) => {
  const { uuid } = props;
  const { data } = useGetProgramApplicationFrameDetail(uuid);
  const router = useRouter();

  // 프로그램 신청 상태
  const { constants: applicationExhibitionStatusOptions } = useSpecificConstant(
    'const_application_exhibition_status',
  );
  const applicationExhibitionStatusLabel = useGetConstantLabel(
    applicationExhibitionStatusOptions,
    data?.constApplicationExhibitionStatus,
  );
  return (
    <div className="default-layout-content gap-between-header-footer flex-1">
      <ContentMyPageHeaderDetail
        title="상세 내역"
        onClick={() => router.back()}
      />

      <div className="mt-[56px] flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <MyPageHeaderInfoTitle
            title="신청 프로그램 정보"
            modify={applicationExhibitionStatusLabel === '신청 접수'}
            onClick={() =>
              router.push(`/mypage/programs-history/frame/${uuid}/edit`)
            }
          />
          <FrameItem
            application={{
              constPaymentMethod: data?.constPaymentMethod || '',
              programType: data?.constApplicationType || '',
              appliedAt: new Date(data?.createdAt || ''),
              constApplicationExhibitionStatus:
                data?.constApplicationExhibitionStatus || '',
              orderId: data?.applicationId || '',
              file: data?.thumbnail || {
                link: '/images/default-image.png',
                originalName: '',
                size: 0,
                url: '',
              },
              title: data?.title || '',
              publisher: data?.publisher || '',
              year: data?.year || 0,
              round: data?.round || 0,
              price: data?.price || 0,
            }}
            detail={false}
            padding={false}
          />
        </div>

        <PublisherItem email={data?.responsiblePublisherEmail || ''} />

        <ShippingItem
          recipient={data?.name || ''}
          phone={data?.phone || ''}
          address={
            `[${data?.addressZipCode}] ${data?.addressDefault} ${data?.addressDetail}` ||
            ''
          }
        />

        <ApplyItem
          organizationName={data?.institution || ''}
          organizationPhoneNumber={data?.institutionPhone || ''}
        />

        <PriceItem
          total={data?.price.toLocaleString() || '0'}
          shippingFee={'상품 가격에 포함'}
          finalAmount={data?.price.toLocaleString() || '0'}
          paymentUuid={data?.paymentUuid || ''}
          type="frame"
        />

        <DocumentItem
          requestDocuments={data?.requestDocuments || ''}
          businessRegistration={
            data?.file || {
              link: '',
              originalName: '',
              size: 0,
              url: '',
            }
          }
          taxInvoiceEmail={data?.taxInvoiceEmail || ''}
        />

        {data?.messageList?.map((item, index) => (
          <TuningItem
            key={index}
            title={item.messageType}
            info={item.message}
          />
        ))}
      </div>

      <div className="mt-[36px] flex justify-center">
        <CButton
          onClick={() => router.back()}
          buttonType="outlined"
          text="목록"
          textClassName="font-body1 text-gray-700"
        ></CButton>
      </div>
    </div>
  );
};

export default FrameDetailItemView;
