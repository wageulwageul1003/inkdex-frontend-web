import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';

const TuningItem = ({ title, info }: { title?: string; info: string }) => {
  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title={title} modify={false} />
      <div className="flex flex-col gap-6 lg:gap-3">
        <MyPageHeaderSubTitle value={info} />
      </div>
    </div>
  );
};

export default TuningItem;
