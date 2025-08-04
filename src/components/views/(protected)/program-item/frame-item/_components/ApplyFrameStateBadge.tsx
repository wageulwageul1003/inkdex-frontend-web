import StateBadge from '@/components/shared/SateBadge';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

const getApplyFrameStateBadgeProps = (status: string) => {
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

interface ApplyFrameStateBadgeProps {
  status: string;
}

const ApplyFrameStateBadge = ({ status }: ApplyFrameStateBadgeProps) => {
  const { constants: constApplicationExhibitionStatus } = useSpecificConstant(
    'const_application_exhibition_status',
  );
  const constApplicationExhibitionStatusLabel = useGetConstantLabel(
    constApplicationExhibitionStatus,
    status,
  );

  const { type, grade } = getApplyFrameStateBadgeProps(
    constApplicationExhibitionStatusLabel || '',
  );

  return (
    <StateBadge
      text={constApplicationExhibitionStatusLabel || ''}
      type={type}
      grade={grade}
    />
  );
};

export default ApplyFrameStateBadge;
