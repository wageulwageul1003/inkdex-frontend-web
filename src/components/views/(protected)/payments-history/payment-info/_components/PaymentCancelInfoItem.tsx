import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

const PaymentCancelInfoItem = ({
  refundAccountNumber,
  refundBankCode,
  refundDepositor,
}: {
  refundAccountNumber: string;
  refundBankCode: string;
  refundDepositor: string;
}) => {
  const { constants: bankCode } = useSpecificConstant('const_bank_code');
  const bankCodeLabel = useGetConstantLabel(bankCode, refundBankCode);

  return (
    <div className="flex flex-col gap-4">
      <MyPageHeaderInfoTitle title="환불 계좌 정보" modify={false} />

      <div className="flex flex-col gap-3">
        <MyPageHeaderSubTitle subTitle="예금주" value={refundDepositor} />
        <MyPageHeaderSubTitle
          subTitle="입금 계좌"
          value={refundAccountNumber}
        />
        <MyPageHeaderSubTitle subTitle="입금 은행" value={bankCodeLabel} />
      </div>
    </div>
  );
};

export default PaymentCancelInfoItem;
