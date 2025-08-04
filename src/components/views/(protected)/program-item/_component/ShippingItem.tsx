import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';

const ShippingItem = ({
  recipient,
  phone,
  address,
}: {
  recipient: string;
  phone: string;
  address: string;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title="배송지 정보" />
      <div className="flex flex-col gap-6 lg:gap-3">
        <MyPageHeaderSubTitle subTitle="받는 분" value={recipient} />
        <MyPageHeaderSubTitle subTitle="휴대번호" value={phone} />
        <MyPageHeaderSubTitle subTitle="주소" value={address} />
      </div>
    </div>
  );
};

export default ShippingItem;
