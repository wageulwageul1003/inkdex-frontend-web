import dayjs from 'dayjs';
import Image from 'next/image';

import ApplyFrameStateBadge from '../../../program-item/frame-item/_components/ApplyFrameStateBadge';

import { cn } from '@/lib/utils';
import { IFile } from '@/types/global';

interface FrameItemProps {
  application: {
    createdAt: Date;
    constApplicationExhibitionStatus: string;
    orderId: string;
    file: IFile;
    title: string;
    publisher: string;
  };
  detail?: boolean;
  payment?: boolean;
  padding?: boolean;
}

export const FrameItem: React.FC<FrameItemProps> = ({
  application,
  detail = true,
  payment = false,
  padding = true,
}) => {
  return (
    <div
      className={cn('flex flex-col gap-3 pb-6 pt-3', !padding && 'pb-0 pt-0')}
    >
      <div className="flex items-center justify-between">
        <span className="font-body1-bold text-gray-700">
          {dayjs(application.createdAt).format('YYYY-MM-DD')}
        </span>
      </div>

      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ApplyFrameStateBadge
              status={application.constApplicationExhibitionStatus}
            />
            <div className="flex items-center gap-1">
              <span className="font-caption text-gray-500">주문번호 :</span>
              <span className="font-caption text-gray-700">
                {application.orderId}
              </span>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="relative aspect-square h-20 w-20 rounded border border-gray-200">
              <Image
                src={application.file.link || '/images/default-image.png'}
                alt={application.title}
                objectFit="cover"
                fill={true}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="font-caption-bold text-gray-500">
                  액자 전시
                </span>
                <h3 className="font-body1-bold text-black">
                  {application.title}
                </h3>
              </div>
              <span className="font-caption text-gray-500">
                {application.publisher}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
