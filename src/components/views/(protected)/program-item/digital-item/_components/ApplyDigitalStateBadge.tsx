import StateBadge from '@/components/shared/SateBadge';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

const getApplyDigitalStateBadgeProps = (status: string) => {
  switch (status) {
    case '신청 접수':
      return { type: 'black', grade: 2 };
    case '신청 마감':
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

interface ApplyDigitalStateBadgeProps {
  status: string;
}

const ApplyDigitalStateBadge = ({ status }: ApplyDigitalStateBadgeProps) => {
  const { constants: constApplicationDigitalStatus } = useSpecificConstant(
    'const_application_digital_status',
  );

  const constApplicationDigitalStatusLabel = useGetConstantLabel(
    constApplicationDigitalStatus,
    status,
  );

  const { type, grade } = getApplyDigitalStateBadgeProps(
    constApplicationDigitalStatusLabel || '',
  );

  return (
    <StateBadge
      text={constApplicationDigitalStatusLabel || ''}
      type={type}
      grade={grade}
    />
  );
};

export default ApplyDigitalStateBadge;
