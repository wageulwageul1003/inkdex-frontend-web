import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import PaymentItemStateBadge from './PaymentItemStateBadge';

import CTextButton from '@/components/shared/CTextButton';
import CIconButton from '@/components/shared/IconButton';
import { Icons } from '@/components/shared/icons';
import { IPaymentKitProgram } from '@/types/program';

interface KitItemProps {
  application: IPaymentKitProgram;
}

const PaymentKitItem: React.FC<KitItemProps> = ({ application }) => {
  const router = useRouter();
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3 pb-6 pt-3">
      <div className="flex items-center justify-between">
        <span className="font-body1-bold text-gray-700">
          {dayjs(application.createdAt).format('YYYY-MM-DD HH:mm')}
        </span>
        <CTextButton
          iconPosition="right"
          icon={
            <Icons.keyboard_arrow_right className="h-xs w-xs fill-gray-500" />
          }
          text="상세 내역"
          onClick={() => {
            router.push(`/mypage/payments-history/kit/${application.uuid}`);
          }}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex gap-5">
            <div className="flex flex-col md:gap-3">
              <div>
                <span className="font-caption-bold text-gray-500">
                  독서 활동 키트
                </span>
                <h3 className="font-body1-bold text-black">
                  {application.title}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PaymentItemStateBadge status={application.constPaymentStatus} />
            <div className="flex items-center gap-1">
              <span className="font-caption text-gray-500">주문번호 :</span>
              <span className="font-caption text-gray-700">
                {application.applicationId}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-1 flex flex-row items-center justify-end gap-3 md:flex-col md:items-end md:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-caption shrink-0 text-gray-500">
              {application.quantity}개
            </span>
            <div className="h-3 w-[1px] bg-gray-200" />

            <span className="font-body2-bold shrink-0 text-black">
              {application.totalPrice.toLocaleString()}원
            </span>
          </div>
          {application.memo && (
            <div className="relative">
              <CIconButton
                buttonType="subtle"
                size="small"
                icon={<Icons.sticky_note_2 className="h-m w-m fill-gray-500" />}
                onClick={() => setIsNoteOpen(true)}
              />

              {isNoteOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 flex w-[320px] flex-col gap-2 rounded border border-gray-200 bg-white px-4 pb-3 pt-2 shadow-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body1 text-gray-700">
                      결제 참고 사항
                    </span>
                    <CIconButton
                      buttonType="only"
                      size="small"
                      icon={<Icons.close className="h-m w-m fill-gray-700" />}
                      onClick={() => setIsNoteOpen(false)}
                    />
                  </div>
                  <div className="flex cursor-pointer items-center rounded bg-gray-100 p-2">
                    <span className="font-caption text-gray-700">
                      {application.memo}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentKitItem;
