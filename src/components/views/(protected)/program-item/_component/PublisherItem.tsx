import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';

const PublisherItem = ({ email }: { email: string }) => {
  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title="담당 출판사 정보" modify={false} />
      <div className="flex flex-col gap-6 lg:gap-3">
        <MyPageHeaderSubTitle subTitle="담당자 이메일" value={email} />
      </div>
    </div>
  );
};

export default PublisherItem;
