'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import PaymentInfoItem from '../../program-item/_component/PaymentInfoItem';
import PaymentItem from '../../program-item/_component/PaymentItem';
import PriceItem from '../../program-item/_component/PriceItem';
import PaymentCancelInfoItem from '../payment-info/_components/PaymentCancelInfoItem';
import PaymentCancelPriceItem from '../payment-info/_components/PaymentCancelPriceItem';

import { FrameItem } from './_components/FrameDetailItem';

import CButton from '@/components/shared/CButton';
import {
  ContentMyPageHeaderDetail,
  MyPageHeaderInfoTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';
import { useGetProgramApplicationPaymentDetail } from '@/hooks/program/application/useGetProgramApplicationPaymentDetail';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';

interface TProps {
  uuid: string;
}

export const FrameDetailNewView: FC<TProps> = (props) => {
  const { uuid } = props;
  const { data } = useGetProgramApplicationPaymentDetail(uuid);
  const router = useRouter();

  // 진행 상태
  const { constants: paymentStatus } = useSpecificConstant(
    'const_payment_status',
  );
  const { constants: paymentMethod } = useSpecificConstant(
    'const_payment_method',
  );

  const paymentStatusLabel = useGetConstantLabel(
    paymentStatus,
    data?.constPaymentStatus,
  );
  const paymentMethodLabel = useGetConstantLabel(
    paymentMethod,
    data?.constPaymentMethod,
  );

  return (
    <div className="default-layout-content gap-between-header-footer flex-1">
      <ContentMyPageHeaderDetail
        title="결제 상세 내역"
        onClick={() => router.push('/mypage/payments-history?tab=exhibition')}
      />

      <div className="mt-4 flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4">
            <MyPageHeaderInfoTitle
              title="신청 프로그램 정보"
              modify={true}
              modifyText="프로그램 상세 확인"
              onClick={() =>
                router.push(
                  `/mypage/programs-history/frame/${data?.applicationId}`,
                )
              }
            />
          </div>

          <FrameItem
            application={{
              createdAt: new Date(data?.createdAt || ''),
              constApplicationExhibitionStatus:
                data?.constApplicationStatus || '',
              orderId: data?.applicationId || '',
              file: data?.file || {
                link: '',
                originalName: '',
                size: 0,
                url: '',
              },
              title: data?.title || '',
              publisher: data?.publisher || '',
            }}
            detail={false}
            padding={false}
          />
        </div>

        <PriceItem
          total={data?.price.toLocaleString() || '0'}
          shippingFee={'상품 가격에 포함'}
          finalAmount={data?.price.toLocaleString() || '0'}
          type="frame"
        />

        <PaymentItem
          paymentStatus={data?.constPaymentStatus || ''}
          orderAt={data?.createdAt || ''}
          totalAmount={data?.price.toLocaleString() || '0'}
          paymentMethod={data?.constPaymentMethod || ''}
          bankAccount={data?.virtualAccountInfo || ''}
          dueAt={data?.virtualAccountDueDate || ''}
          receiptUrl={data?.receiptUrl || ''}
          canceledAt={data?.canceledAt || ''}
        />

        {/* 환불 가격 */}
        {paymentStatusLabel === '결제 취소' && (
          <PaymentCancelPriceItem cancelPrice={data?.cancelPrice || 0} />
        )}

        {/* 환불 + 가상 계좌 결제 */}
        {paymentStatusLabel === '결제 취소' &&
          paymentMethodLabel === '무통장입금(가상계좌)' && (
            <PaymentCancelInfoItem
              refundAccountNumber={data?.refundAccountNumber || ''}
              refundBankCode={data?.refundBankCode || ''}
              refundDepositor={data?.refundDepositor || ''}
            />
          )}

        {/* 결제 참고 사항 */}
        <PaymentInfoItem info={data?.memo || '-'} />
      </div>

      <div className="mt-[56px] flex justify-center">
        <CButton
          onClick={() => router.push(`/mypage/payments-history?tab=exhibition`)}
          buttonType="outlined"
          text="목록"
          textClassName="font-body1 text-gray-700"
        ></CButton>
      </div>
    </div>
  );
};

export default FrameDetailNewView;
