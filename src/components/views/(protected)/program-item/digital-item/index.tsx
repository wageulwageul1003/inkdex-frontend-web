'use client';

import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

import {
  ContentMyPageHeaderDetail,
  MyPageHeaderInfoTitle,
} from '../../../../shared/page-headers/ContentMyPageHeader';
import ApplyItem from '../_component/ApplyItem';
import PublisherItem from '../_component/PublisherItem';
import TuningItem from '../_component/TuningItem';

import DigitalItem from './_components/DigitalItem';

import CButton from '@/components/shared/CButton';
import { useGetProgramApplicationDigitalDetail } from '@/hooks/program/application/useGetProgramApplicationDigitalDetail';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

interface TProps {
  uuid: string;
}

export const DigitalDetailItemView: FC<TProps> = (props) => {
  const { uuid } = props;
  const { data } = useGetProgramApplicationDigitalDetail(uuid);
  const router = useRouter();

  // 프로그램 신청 상태
  const { constants: applicationDigitalStatusOptions } = useSpecificConstant(
    'const_application_digital_status',
  );
  const applicationDigitalStatusLabel = useGetConstantLabel(
    applicationDigitalStatusOptions,
    data?.constApplicationDigitalStatus,
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
            modify={applicationDigitalStatusLabel === '신청 접수'}
            onClick={() =>
              router.push(`/mypage/programs-history/digital/${uuid}/edit`)
            }
          />
          <DigitalItem
            application={{
              programType: data?.constApplicationType || '',
              appliedAt: new Date(data?.createdAt || ''),
              constApplicationDigitalStatus:
                data?.constApplicationDigitalStatus || '',
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
              month: data?.month || 0,
              price: data?.price || 0,
            }}
            detail={false}
            padding={false}
          />
        </div>

        <PublisherItem email={data?.responsiblePublisherEmail || '-'} />

        <ApplyItem
          receiptEmail={data?.email || '-'}
          name={data?.name || '-'}
          phoneNumber={data?.phone || '-'}
          organizationName={data?.institution || '-'}
          organizationPhoneNumber={data?.institutionPhone || '-'}
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

export default DigitalDetailItemView;
