import dayjs from 'dayjs';

import Seed from '@/components/shared/Seed';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

export interface PointHistoryItemProps {
  content: string;
  date: string;
  count: number;
  type: string;
}

export const PointHistoryItem = ({
  content,
  date,
  count,
  type,
}: PointHistoryItemProps) => {
  const { constants: pointType } = useSpecificConstant('const_point_type');

  const pointTypeLabel = useGetConstantLabel(pointType, type);

  return (
    <div className="flex w-full items-center justify-between gap-6 py-5">
      <div className="flex flex-col justify-between gap-1">
        <span className="font-body1-bold text-gray-700">{content}</span>
        <div className="flex items-center gap-1">
          <span className="font-caption text-gray-500">사용 : </span>
          <span className="font-caption text-gray-700">
            {dayjs(date).format('YYYY-MM-DD')}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Seed />
        {pointTypeLabel === '포인트 지급' ? (
          <span className="font-body2-bold text-green-700">+{count}씨앗</span>
        ) : (
          <span className="font-body2-bold text-gray-500">{count}씨앗</span>
        )}
      </div>
    </div>
  );
};
