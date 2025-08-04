import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';

const PaymentInfoItem = ({ info }: { info: string }) => {
  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title="결제 참고 사항" modify={false} />
      <div className="flex flex-col gap-6 lg:gap-3">
        <MyPageHeaderSubTitle value={info} />
      </div>
    </div>
  );
};

export default PaymentInfoItem;
