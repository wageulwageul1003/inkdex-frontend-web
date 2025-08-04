import StateBadge from '@/components/shared/SateBadge';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

const getApplyKitStateBadgeProps = (status: string) => {
  switch (status) {
    case '신청 접수':
      return { type: 'black', grade: 2 };
    case '발송 대기':
      return { type: 'blue', grade: 2 };
    case '발송 완료':
      return { type: 'green', grade: 2 };
    case '신청 취소':
      return { type: 'red', grade: 2 };
    case '발송 취소':
      return { type: 'red', grade: 2 };
    default:
      return { type: 'gray', grade: 2 };
  }
};

interface ApplyKitStateBadgeProps {
  status: string;
}

const ApplyKitStateBadge = ({ status }: ApplyKitStateBadgeProps) => {
  const { constants: constApplicationReadingKitStatus } = useSpecificConstant(
    'const_application_reading_kit_status',
  );

  const constApplicationReadingKitStatusLabel = useGetConstantLabel(
    constApplicationReadingKitStatus,
    status,
  );

  const { type, grade } = getApplyKitStateBadgeProps(
    constApplicationReadingKitStatusLabel || '',
  );

  return (
    <StateBadge
      text={constApplicationReadingKitStatusLabel || ''}
      type={type}
      grade={grade}
    />
  );
};

export default ApplyKitStateBadge;
