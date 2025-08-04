'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

import {
  ContentMyPageHeaderDetail,
  MyPageHeaderInfoTitle,
} from '../../../../shared/page-headers/ContentMyPageHeader';
import ApplyItem from '../_component/ApplyItem';
import ProposerItem from '../_component/ProposerItem';
import PublisherItem from '../_component/PublisherItem';
import TuningItem from '../_component/TuningItem';

import LectureItem from './_components/LectureItem';

import CButton from '@/components/shared/CButton';
import { TAX_INCLUDED_OPTIONS } from '@/constants/constant';
import { useGetProgramApplicationLectureDetail } from '@/hooks/program/application/useGetProgramApplicationLectureDetail';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

interface TProps {
  uuid: string;
}

export const LectureDetailItemView: FC<TProps> = (props) => {
  const { uuid } = props;
  const { data } = useGetProgramApplicationLectureDetail(uuid);
  const router = useRouter();

  // 강연 장소
  const { constants: lectureFormOptions } =
    useSpecificConstant('const_lecture_form');
  const lectureFormLabel = useGetConstantLabel(
    lectureFormOptions,
    data?.constLectureForm,
  );

  // 세금 포함 여부
  const taxIncludedLabel = useGetConstantLabel(
    TAX_INCLUDED_OPTIONS,
    data?.isTaxIncluded,
  );

  // 프로그램 신청 상태
  const { constants: applicationLectureStatusOptions } = useSpecificConstant(
    'const_application_lecture_status',
  );
  const applicationLectureStatusLabel = useGetConstantLabel(
    applicationLectureStatusOptions,
    data?.constApplicationLectureStatus,
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
            modify={
              applicationLectureStatusLabel === '신청 접수' ||
              applicationLectureStatusLabel === '조율중' ||
              applicationLectureStatusLabel === '장기 미조율' ||
              applicationLectureStatusLabel === '검토중'
            }
            onClick={() =>
              router.push(`/mypage/programs-history/lecture/${uuid}/edit`)
            }
          />
          <LectureItem
            application={{
              programType: data?.constApplicationType || '-',
              appliedAt: new Date(data?.createdAt || ''),
              constApplicationLectureStatus:
                data?.constApplicationLectureStatus || '-',
              orderId: data?.applicationId || '-',
              file: data?.thumbnail || {
                link: '/images/default-image.png',
                originalName: '',
                size: 0,
                url: '',
              },
              title: data?.title || '-',
              publisher: data?.publisher || '-',
            }}
            detail={false}
            padding={false}
          />
        </div>

        <PublisherItem email={data?.responsiblePublisherEmail || '-'} />

        <ApplyItem
          lectureDate1={
            dayjs(data?.preferredStartTimeFirst || '').format(
              'YYYY-MM-DD HH:mm',
            ) +
            ' ~ ' +
            dayjs(data?.preferredEndTimeFirst || '').format('YYYY-MM-DD HH:mm')
          }
          lectureDate2={
            data?.preferredStartTimeSecond
              ? dayjs(data?.preferredStartTimeSecond || '').format(
                  'YYYY-MM-DD HH:mm',
                ) +
                ' ~ ' +
                dayjs(data?.preferredEndTimeSecond || '').format(
                  'YYYY-MM-DD HH:mm',
                )
              : '-'
          }
          lecturePlace={{
            lectureFormLabel: lectureFormLabel ?? '-',
            address:
              data?.addressZipCode === ''
                ? '-'
                : `[${data?.addressZipCode}] ${data?.addressDefault} ${data?.addressDetail}`,
          }}
          participantCount={
            data?.isAttendeesUndecided === true
              ? '인원 미정'
              : `${data?.minAttendees?.toLocaleString()} ~ ${data?.maxAttendees?.toLocaleString()}명`
          }
          lectureContent={data?.targetAudience || '-'}
          applicationPurpose={data?.requestMemo || '-'}
          paymentEstimate={{
            taxIncludedLabel: taxIncludedLabel ?? '-',
            totalBudget: data?.totalBudget?.toLocaleString() || '-',
          }}
          paymentDetail={{
            photographyFee: data?.instructorFee?.toLocaleString() || '-',
            rentalFee: data?.manuscriptFee?.toLocaleString() || '-',
            transportationFee: data?.transportFee?.toLocaleString() || '-',
            materialFee: data?.materialFee?.toLocaleString() || '-',
          }}
        />

        <ProposerItem
          proposerName={data?.name || ''}
          phone={data?.phone || ''}
          additionalPhone={data?.phone || ''}
          organizationName={data?.institution || ''}
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

export default LectureDetailItemView;
