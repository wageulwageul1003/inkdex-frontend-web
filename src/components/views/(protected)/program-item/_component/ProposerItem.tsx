import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';

const ProposerItem = ({
  proposerName,
  phone,
  additionalPhone,
  organizationName,
}: {
  proposerName: string;
  phone: string;
  additionalPhone: string;
  organizationName: string;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title="신청자 정보" modify={false} />
      <div className="flex flex-col gap-6 lg:gap-3">
        <MyPageHeaderSubTitle subTitle="이름" value={proposerName} />
        <MyPageHeaderSubTitle subTitle="휴대번호" value={phone} />
        <MyPageHeaderSubTitle subTitle="추가 연락처" value={additionalPhone} />
        <MyPageHeaderSubTitle subTitle="기관명" value={organizationName} />
      </div>
    </div>
  );
};

export default ProposerItem;
