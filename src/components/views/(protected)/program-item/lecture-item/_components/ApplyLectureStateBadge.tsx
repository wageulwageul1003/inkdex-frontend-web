import StateBadge from '@/components/shared/SateBadge';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

const getApplyLectureStateBadgeProps = (status: string) => {
  switch (status) {
    case '신청 접수':
      return { type: 'black', grade: 2 };
    case '장기 미조율':
      return { type: 'black', grade: 1 };
    case '검토중':
      return { type: 'blue', grade: 2 };
    case '조율중':
      return { type: 'blue', grade: 1 };
    case '조율 완료':
      return { type: 'green', grade: 2 };
    case '신청 취소':
      return { type: 'red', grade: 2 };
    case '협의 불가':
      return { type: 'red', grade: 2 };
    default:
      return { type: 'gray', grade: 2 };
  }
};

interface ApplyLectureStateBadgeProps {
  status: string;
}

const ApplyLectureStateBadge = ({ status }: ApplyLectureStateBadgeProps) => {
  const { constants: constApplicationLectureStatus } = useSpecificConstant(
    'const_application_lecture_status',
  );

  const constApplicationLectureStatusLabel = useGetConstantLabel(
    constApplicationLectureStatus,
    status,
  );

  const { type, grade } = getApplyLectureStateBadgeProps(
    constApplicationLectureStatusLabel || '',
  );

  return (
    <StateBadge
      text={constApplicationLectureStatusLabel || ''}
      type={type}
      grade={grade}
    />
  );
};

export default ApplyLectureStateBadge;
