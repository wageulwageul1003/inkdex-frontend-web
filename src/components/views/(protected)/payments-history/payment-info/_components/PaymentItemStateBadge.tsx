import StateBadge from '@/components/shared/SateBadge';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

const getPaymentItemStateBadgeProps = (status: string) => {
  switch (status) {
    case '입금 대기':
      return { type: 'black', grade: 2 };
    case '결제 완료':
      return { type: 'green', grade: 2 };
    case '결제 취소':
      return { type: 'red', grade: 2 };
    case '환불 완료':
      return { type: 'red', grade: 2 };
    default:
      return { type: 'gray', grade: 2 };
  }
};

interface PaymentItemStateBadgeProps {
  status: string;
}

const PaymentItemStateBadge = ({ status }: PaymentItemStateBadgeProps) => {
  const { constants: constPaymentStatus } = useSpecificConstant(
    'const_payment_status',
  );

  const constPaymentStatusLabel = useGetConstantLabel(
    constPaymentStatus,
    status,
  );

  const { type, grade } = getPaymentItemStateBadgeProps(
    constPaymentStatusLabel || '',
  );

  return (
    <StateBadge
      text={constPaymentStatusLabel || ''}
      type={type}
      grade={grade}
    />
  );
};

export default PaymentItemStateBadge;
