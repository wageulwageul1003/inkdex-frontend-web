import { NotificationMessage } from '@/components/shared/notification-message/NotificationMessage';
import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';
import { dateToString } from '@/utils/date';

const PaymentItem = ({
  paymentStatus,
  orderAt,
  totalAmount,
  paymentMethod,
  bankAccount,
  dueAt,
  canceledAt,
  receiptUrl,
}: {
  paymentStatus: string;
  orderAt: string;
  totalAmount: string;
  paymentMethod: string;
  bankAccount: string;
  dueAt: string;
  canceledAt: string;
  receiptUrl: string;
}) => {
  // 결제 방식
  const { constants: constPaymentMethod } = useSpecificConstant(
    'const_payment_method',
  );
  const constPaymentMethodLabel = useGetConstantLabel(
    constPaymentMethod,
    paymentMethod,
  );

  const formDate = (date: string) => {
    if (date === '') {
      return '';
    }
    return dateToString(new Date(date), 'yyyy-MM-dd HH:mm');
  };

  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title="결제 정보" modify={false} />
      {paymentStatus !== 'CANCELED' && (
        <NotificationMessage
          type="basic"
          text="결제 취소를 원하시는 경우 프로그램 상세에서 취소 접수를 부탁드립니다. "
        />
      )}

      <div className="flex flex-col gap-6 lg:gap-3">
        <MyPageHeaderSubTitle subTitle="결제 상태" value={paymentStatus} />
        <MyPageHeaderSubTitle subTitle="주문 일시" value={formDate(orderAt)} />
        <MyPageHeaderSubTitle
          subTitle="총 결제 금액"
          value={totalAmount + '원'}
        />
        <MyPageHeaderSubTitle
          subTitle="결제 방법"
          value={constPaymentMethodLabel}
        />
        {bankAccount !== '' && (
          <MyPageHeaderSubTitle subTitle="입금 계좌" value={bankAccount} />
        )}
        {dueAt !== '' && (
          <MyPageHeaderSubTitle
            subTitle="입금 기한"
            value={formDate(dueAt) + ' 까지'}
          />
        )}

        {canceledAt !== '' && (
          <MyPageHeaderSubTitle
            subTitle="취소 일시"
            value={formDate(canceledAt)}
          />
        )}

        {receiptUrl !== '' && (
          <MyPageHeaderSubTitle
            subTitle="현금영수증 정보"
            value={'현금영수증 다운받기'}
            downloadLink={receiptUrl}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentItem;
