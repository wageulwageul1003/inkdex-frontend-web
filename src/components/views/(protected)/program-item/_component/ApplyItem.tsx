import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';

const ApplyItem = ({
  lectureDate1,
  lectureDate2,
  lecturePlace,
  participantCount,
  lectureContent,
  applicationPurpose,
  paymentEstimate,
  paymentDetail,
  name,
  receiptEmail,
  phoneNumber,
  attachedFile,
  email,
  organizationName,
  organizationPhoneNumber,
  saying,
}: {
  lectureDate1?: string;
  lectureDate2?: string;
  lecturePlace?: {
    lectureFormLabel: string;
    address: string;
  };
  participantCount?: string;
  lectureContent?: string;
  applicationPurpose?: string;
  paymentEstimate?: {
    taxIncludedLabel: string;
    totalBudget: string;
  };
  paymentDetail?: {
    photographyFee?: string;
    rentalFee?: string;
    transportationFee?: string;
    materialFee?: string;
  };
  name?: string;
  receiptEmail?: string;
  phoneNumber?: string;
  attachedFile?: string;
  email?: string;
  organizationName?: string;
  organizationPhoneNumber?: string;
  saying?: string;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title="신청 정보" modify={false} />
      <div className="flex flex-col gap-6 lg:gap-3">
        {lectureDate1 && (
          <MyPageHeaderSubTitle
            subTitle="희망 강연일 (1)"
            value={lectureDate1}
          />
        )}
        {lectureDate2 && (
          <MyPageHeaderSubTitle
            subTitle="희망 강연일 (2)"
            value={lectureDate2.toString()}
          />
        )}
        {lecturePlace && (
          <MyPageHeaderSubTitle
            subTitle="강연 장소"
            value={[
              `${lecturePlace.lectureFormLabel}`,
              `${lecturePlace.address}`,
            ]}
          />
        )}
        {participantCount && (
          <MyPageHeaderSubTitle subTitle="참석 인원" value={participantCount} />
        )}
        {lectureContent && (
          <MyPageHeaderSubTitle subTitle="강연 대상" value={lectureContent} />
        )}
        {applicationPurpose && (
          <MyPageHeaderSubTitle
            subTitle="요청 사항"
            value={applicationPurpose}
          />
        )}
        {paymentEstimate && (
          <MyPageHeaderSubTitle
            subTitle="행사 총 예산"
            value={[
              `${paymentEstimate.taxIncludedLabel}`,
              `${paymentEstimate.totalBudget.toLocaleString()}원`,
            ]}
          />
        )}
        {paymentDetail && (
          <MyPageHeaderSubTitle
            subTitle="상세 예산"
            value={[
              `강사료 : ${`${paymentDetail.photographyFee?.toLocaleString()}원` || '-'}`,
              `원고료 : ${`${paymentDetail.rentalFee?.toLocaleString()}원` || '-'}`,
              `교통비 : ${`${paymentDetail.transportationFee?.toLocaleString()}원` || '-'}`,
              `재료비 : ${`${paymentDetail.materialFee?.toLocaleString()}원` || '-'}`,
            ]}
          />
        )}
        {receiptEmail && (
          <MyPageHeaderSubTitle subTitle="수령 이메일" value={receiptEmail} />
        )}
        {name && <MyPageHeaderSubTitle subTitle="이름" value={name} />}
        {phoneNumber && (
          <MyPageHeaderSubTitle subTitle="휴대번호" value={phoneNumber} />
        )}
        {attachedFile && (
          <MyPageHeaderSubTitle subTitle="사업자 등록증" value={attachedFile} />
        )}

        {organizationName && (
          <MyPageHeaderSubTitle subTitle="기관명" value={organizationName} />
        )}
        {organizationPhoneNumber && (
          <MyPageHeaderSubTitle
            subTitle="기관 연락처"
            value={organizationPhoneNumber}
          />
        )}
        {email && (
          <MyPageHeaderSubTitle
            subTitle="세금 계산서/ 영수증 이메일"
            value={email}
          />
        )}
        {saying && <MyPageHeaderSubTitle subTitle="요청 사항" value={saying} />}
      </div>
    </div>
  );
};

export default ApplyItem;
