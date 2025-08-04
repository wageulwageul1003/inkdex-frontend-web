import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { refundSchema } from '../../schema';

import ApplyKitStateBadge from './ApplyKitStateBadge';

import CButton from '@/components/shared/CButton';
import CTextButton from '@/components/shared/CTextButton';
import Seed from '@/components/shared/Seed';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { NotificationMessage } from '@/components/shared/notification-message/NotificationMessage';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { usePatchProgramKitCancel } from '@/hooks/program/kit/usePatchProgramKitCancel';
import { useAlert } from '@/hooks/useAlert';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';
import { useModal } from '@/hooks/useModal';
import { cn } from '@/lib/utils';
import { IKitProgram } from '@/types/program';

interface KitItemProps {
  application: IKitProgram;
  detail?: boolean;
  padding?: boolean;
}

interface RefundContentModalProps {
  closeModal: (id: string) => void;
  modalId: React.RefObject<string>;
}

const KitItem: React.FC<KitItemProps> = ({
  application,
  detail = true,
  padding = true,
}) => {
  const router = useRouter();
  const alert = useAlert();
  const refundModal = useModal();
  const modalIdRef = useRef<string>('');

  const { mutateAsync: patchProgramKitCancel } = usePatchProgramKitCancel();

  // 신청 상태
  const { constants: constApplicationReadingKitStatus } = useSpecificConstant(
    'const_application_reading_kit_status',
  );
  const constApplicationReadingKitStatusLabel = useGetConstantLabel(
    constApplicationReadingKitStatus,
    application.constApplicationReadingKitStatus,
  );

  // 결제 방식
  const { constants: constPaymentType } =
    useSpecificConstant('const_payment_type');
  const constPaymentTypeLabel = useGetConstantLabel(
    constPaymentType,
    application.constPaymentType,
  );

  // 결제 방식
  const { constants: constPaymentMethod } = useSpecificConstant(
    'const_payment_method',
  );
  const constPaymentMethodLabel = useGetConstantLabel(
    constPaymentMethod,
    application.constPaymentMethod,
  );

  const form = useForm({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      uuid: application.orderId,
      constBankCode: '',
      accountNumber: '',
      refundDepositor: '',
    },
  });

  const RefundContentModal = ({
    closeModal,
    modalId,
  }: RefundContentModalProps) => {
    // Form is now defined in parent scope

    // 입금 은행
    const { constants: bankCode } = useSpecificConstant('const_bank_code');

    return (
      <div className="fit-h relative">
        <NotificationMessage text="환불 처리는 영업일 기준 1~5일 정도 소요될 수 있습니다." />

        <div className="mt-4">
          <Form {...form}>
            <form className="relative mt-7 space-y-5">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                label="예금주"
                placeholder="예금주 입력"
                name="refundDepositor"
                required
              />

              <FormFields
                fieldType={FormFieldType.SELECT}
                control={form.control}
                label="입금 은행"
                name="constBankCode"
                placeholder="입금 은행 선택"
                options={bankCode}
                required
              />

              <FormFields
                fieldType={FormFieldType.NUMBER_INPUT}
                control={form.control}
                label="계좌번호"
                labelSlot={
                  <span className="font-caption mb-2 text-gray-500">
                    ‘-’없이 숫자만 입력해 주세요.
                  </span>
                }
                placeholder="계좌번호 입력"
                name="accountNumber"
                required
              />
            </form>
          </Form>
        </div>
      </div>
    );
  };

  const handleCancel = () => {
    if (constPaymentTypeLabel === '포인트 전용') {
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
          // Call the mutation
          const result = await patchProgramKitCancel({
            uuid: application.orderId,
            constBankCode: '',
            accountNumber: '',
            refundDepositor: '',
          });
          if (result.code === 2000) {
            toast.success(
              '프로그램 신청이 취소되었습니다.',
              '환불이 필요한 경우, 영업일 기준 15일 이내 처리됩니다.',
            );
            router.replace(
              '/mypage/programs-history?constProgramType=reading_kit',
            );
          }
        },
      });
    } else {
      if (constPaymentMethodLabel === '무통장입금(가상계좌)') {
        const modal = refundModal({
          title: '환불 계좌 등록',
          description: (
            <RefundContentModal
              closeModal={(id) => refundModal.closeAlert(id)}
              modalId={modalIdRef}
            />
          ),
          confirmText: '등록',
          cancelText: '닫기',
          onConfirm: () => {
            refundModal.closeAlert(modalIdRef.current);
            const formValues = form.getValues();

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
                const result = await patchProgramKitCancel({
                  uuid: formValues.uuid,
                  constBankCode: formValues.constBankCode,
                  accountNumber: formValues.accountNumber,
                  refundDepositor: formValues.refundDepositor,
                });

                if (result.code === 2000) {
                  toast.success(
                    '프로그램 신청이 취소되었습니다.',
                    '환불이 필요한 경우, 영업일 기준 15일 이내 처리됩니다.',
                  );
                  router.push('/mypage/programs-history');
                }
              },
            });
          },
        });

        // Store the modal ID in a ref for later use
        modalIdRef.current = modal.id;
      } else {
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
            // Call the mutation
            const result = await patchProgramKitCancel({
              uuid: application.orderId,
              constBankCode: '',
              accountNumber: '',
              refundDepositor: '',
            });
            if (result.code === 2000) {
              toast.success(
                '프로그램 신청이 취소되었습니다.',
                '환불이 필요한 경우, 영업일 기준 15일 이내 처리됩니다.',
              );
              router.push('/mypage/programs-history');
            }
          },
        });
      }
    }
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
                `/mypage/programs-history/kit/${application.orderId}`,
              );
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ApplyKitStateBadge
              status={application.constApplicationReadingKitStatus}
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
              {application.file.link && (
                <Image
                  src={application.file.link || '/images/default-image.png'}
                  alt={application.title}
                  objectFit="cover"
                  fill={true}
                />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="font-caption-bold text-gray-500">
                  독서 활동 키트
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
              {application.quantity}개
            </span>
            <div className="h-3 w-[1px] bg-gray-200" />

            {constPaymentTypeLabel === '포인트 전용' ? (
              <div className="flex items-center gap-2">
                <Seed />
                <span className="font-body2-bold text-black">
                  {application.totalPrice.toLocaleString()}씨앗
                </span>
              </div>
            ) : (
              <span className="font-body2-bold text-black">
                {application.totalPrice.toLocaleString()}원
              </span>
            )}
          </div>
          <div className="flex justify-end">
            {(constApplicationReadingKitStatusLabel === '신청 접수' ||
              constApplicationReadingKitStatusLabel === '입금 대기') && (
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

export default KitItem;
