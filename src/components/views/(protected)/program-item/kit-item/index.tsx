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

import KitItem from './_components/KitItem';

import CButton from '@/components/shared/CButton';
import { useGetProgramApplicationKitDetail } from '@/hooks/program/application/useGetProgramApplicationKitDetail';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

interface TProps {
  uuid: string;
}

export const KitDetailItemView: FC<TProps> = (props) => {
  const { uuid } = props;
  const { data } = useGetProgramApplicationKitDetail(uuid);
  const router = useRouter();

  const { constants: constPaymentType } =
    useSpecificConstant('const_payment_type');
  const constPaymentTypeLabel = useGetConstantLabel(
    constPaymentType,
    data?.constPaymentType,
  );

  // 프로그램 신청 상태
  const { constants: applicationReadingKitStatusOptions } = useSpecificConstant(
    'const_application_reading_kit_status',
  );
  const applicationReadingKitStatusLabel = useGetConstantLabel(
    applicationReadingKitStatusOptions,
    data?.constApplicationReadingKitStatus,
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
            modify={applicationReadingKitStatusLabel === '신청 접수'}
            onClick={() =>
              router.push(`/mypage/programs-history/kit/${uuid}/edit`)
            }
          />
          <KitItem
            application={{
              constPaymentMethod: data?.constPaymentMethod || '',
              programType: data?.constApplicationType || '-',
              appliedAt: new Date(data?.createdAt || ''),
              constApplicationReadingKitStatus:
                data?.constApplicationReadingKitStatus || '-',
              orderId: data?.applicationId || '-',
              file: data?.thumbnail || {
                link: '/images/default-image.png',
                originalName: '',
                size: 0,
                url: '',
              },
              title: data?.name || '-',
              totalPrice: data?.totalPrice || 0,
              price: data?.price || 0,
              quantity: data?.quantity || 0,
              constPaymentType: data?.constPaymentType || '-',
              publisher: data?.publisher || '-',
            }}
            detail={false}
            padding={false}
          />
        </div>

        {constPaymentTypeLabel !== '포인트 전용' ? (
          <>
            <PublisherItem email={data?.responsiblePublisherEmail || '-'} />
            <ShippingItem
              recipient={data?.name || '-'}
              phone={data?.phone || '-'}
              address={data?.addressDefault || '-'}
            />
            <ApplyItem
              organizationName={data?.institution || '-'}
              organizationPhoneNumber={data?.institutionPhone || '-'}
            />
            <PriceItem
              total={data?.price?.toLocaleString() || '0'}
              shippingFee={
                (data?.shippingFee?.toLocaleString() || '0') + '원' || '0'
              }
              finalAmount={data?.totalPrice?.toLocaleString() || '0'}
              paymentUuid={data?.paymentUuid}
              type="kit"
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
          </>
        ) : (
          <>
            <ShippingItem
              recipient={data?.name || '-'}
              phone={data?.phone || '-'}
              address={data?.addressDefault || '-'}
            />
            <ApplyItem
              organizationName={data?.institution || '-'}
              organizationPhoneNumber={data?.institutionPhone || '-'}
              saying={data?.requestMemo || '-'}
            />
          </>
        )}
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

export default KitDetailItemView;
