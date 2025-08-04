import { useRouter } from 'next/navigation';

import {
  MyPageHeaderBoxSubTitle,
  MyPageHeaderInfoTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';

const PriceItem = ({
  total,
  shippingFee,
  finalAmount,
  paymentUuid,
  type,
}: {
  total: string;
  shippingFee: string;
  finalAmount: string;
  paymentUuid?: string;
  type: 'frame' | 'kit';
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle
        title="결제 금액"
        modify={false}
        payment={paymentUuid ? true : false}
        paymentText="상세 결제 정보 확인"
        paymentButtonType="outlined"
        onClick={() =>
          paymentUuid &&
          router.push(`/mypage/payments-history/${type}/${paymentUuid}`)
        }
      />
      <div className="flex flex-col gap-7 rounded border border-gray-200 p-6 shadow-2">
        <div className="flex flex-col gap-2">
          <MyPageHeaderBoxSubTitle
            subTitle="총 상품 금액"
            value={`${total}원`}
          />
          <MyPageHeaderBoxSubTitle subTitle="배송비" value={shippingFee} />
        </div>
        <div className="border-t border-gray-200 pt-4">
          <MyPageHeaderBoxSubTitle
            subTitle="최종 결제 금액"
            value={`${finalAmount}원`}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceItem;
