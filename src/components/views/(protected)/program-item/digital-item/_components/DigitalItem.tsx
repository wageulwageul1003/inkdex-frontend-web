import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import ApplyDigitalStateBadge from './ApplyDigitalStateBadge';

import CButton from '@/components/shared/CButton';
import CTextButton from '@/components/shared/CTextButton';
import Seed from '@/components/shared/Seed';
import { Icons } from '@/components/shared/icons';
import { toast } from '@/components/ui/sonner';
import { usePatchProgramDigitalCancel } from '@/hooks/program/digital/usePatchProgramDigitalCancel';
import { useAlert } from '@/hooks/useAlert';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';
import { cn } from '@/lib/utils';
import { IDigitalProgram } from '@/types/program';

interface DigitalItemProps {
  application: IDigitalProgram;
  detail?: boolean;
  padding?: boolean;
}

const DigitalItem: React.FC<DigitalItemProps> = ({
  application,
  detail = true,
  padding = true,
}) => {
  const router = useRouter();
  const alert = useAlert();
  const { mutateAsync: patchProgramDigitalCancel } =
    usePatchProgramDigitalCancel(application.orderId);

  const { constants: constApplicationDigitalStatus } = useSpecificConstant(
    'const_application_digital_status',
  );

  const constApplicationDigitalStatusLabel = useGetConstantLabel(
    constApplicationDigitalStatus,
    application.constApplicationDigitalStatus,
  );

  const handleCancel = () => {
    alert({
      icon: 'info',
      title: '신청 취소를 진행할까요?',
      description: (
        <div className="flex w-full flex-col items-center">
          <span className="font-body1 text-center text-gray-500">
            신청을 취소하면 복구할 수 없습니다. 정말 취소하시겠습니까?
          </span>
        </div>
      ),
      cancelText: '닫기',
      confirmText: '신청 취소',
      cancelButton: {
        className: 'w-full',
      },
      onConfirm: async () => {
        const result = await patchProgramDigitalCancel();
        if (result.code === 2000) {
          toast.success(
            '프로그램 신청이 취소되었습니다.',
            '환불이 필요한 경우, 영업일 기준 15일 이내 처리됩니다.',
          );
          router.replace(
            '/mypage/programs-history?constProgramType=digital_exhibition',
          );
        }
      },
    });
    return;
  };

  return (
    <div
      className={cn('flex flex-col gap-3 pb-6 pt-3', !padding && 'pb-0 pt-0')}
    >
      <div className="flex items-center justify-between">
        <span className="font-body1-bold text-gray-700">
          {dayjs(application.appliedAt).format('YYYY-MM-DD')}
        </span>
        {detail && (
          <CTextButton
            iconPosition="right"
            icon={
              <Icons.keyboard_arrow_right className="h-xs w-xs fill-gray-500" />
            }
            text="상세 내역"
            onClick={() => {
              router.push(
                `/mypage/programs-history/digital/${application.orderId}`,
              );
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ApplyDigitalStateBadge
              status={application.constApplicationDigitalStatus}
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
                  디지털 전시
                </span>
                <h3 className="font-body1-bold line-clamp-1 text-black">
                  {application.title}
                </h3>
              </div>
              <span className="font-caption text-gray-500">
                {application.publisher}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end gap-2">
            <span className="font-caption text-gray-500">
              {application.year}년 {application.month}월
            </span>
            <div className="h-3 w-[1px] bg-gray-200" />
            <div className="flex items-center gap-2">
              <Seed />
              <span className="font-body2-bold text-black">
                {application.price.toLocaleString()}씨앗
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            {(constApplicationDigitalStatusLabel === '신청 접수' ||
              constApplicationDigitalStatusLabel === '입금 대기') && (
              <CButton
                text="취소 접수"
                size="small"
                buttonType="subtle"
                onClick={() => handleCancel()}
                className="w-fit"
              ></CButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalItem;
