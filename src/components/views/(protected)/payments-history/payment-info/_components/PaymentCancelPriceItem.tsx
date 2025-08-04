import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';

const PaymentCancelPriceItem = ({ cancelPrice }: { cancelPrice: number }) => {
  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title="환불 예정 금액" modify={false} />

      <div className="flex flex-col gap-3">
        <MyPageHeaderSubTitle
          subTitle="환불 예정 금액"
          value={cancelPrice.toLocaleString() + '원'}
        />
      </div>
    </div>
  );
};

export default PaymentCancelPriceItem;
