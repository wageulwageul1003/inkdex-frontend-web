'use client';

import { useRouter } from 'next/navigation';

import PaymentInfoItem from '../../program-item/_component/PaymentInfoItem';
import PaymentItem from '../../program-item/_component/PaymentItem';
import PriceItem from '../../program-item/_component/PriceItem';
import PaymentCancelInfoItem from '../payment-info/_components/PaymentCancelInfoItem';
import PaymentCancelPriceItem from '../payment-info/_components/PaymentCancelPriceItem';

import { KitItem } from './_components/KitDetailItem';

import CButton from '@/components/shared/CButton';
import {
  ContentMyPageHeaderDetail,
  MyPageHeaderInfoTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';
import { useGetProgramApplicationPaymentDetail } from '@/hooks/program/application/useGetProgramApplicationPaymentDetail';

interface TProps {
  uuid: string;
}

export const KitDetailView: React.FC<TProps> = (props) => {
  const { uuid } = props;
  const { data } = useGetProgramApplicationPaymentDetail(uuid);
  const router = useRouter();

  return (
    <div className="default-layout-content gap-between-header-footer flex-1">
      <ContentMyPageHeaderDetail
        title="결제 상세 내역"
        onClick={() => router.push('/mypage/payments-history?tab=reading_kit')}
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
                  `/mypage/programs-history/kit/${data?.applicationId}`,
                )
              }
            />
          </div>

          <KitItem
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
          shippingFee={data?.shippingFee.toLocaleString() + '원' || '0'}
          finalAmount={data?.totalPrice.toLocaleString() || '0'}
          type="kit"
        />

        <PaymentItem
          paymentStatus={data?.constPaymentStatus || ''}
          orderAt={data?.createdAt || ''}
          totalAmount={data?.totalPrice.toLocaleString() || '0'}
          paymentMethod={data?.constPaymentMethod || ''}
          bankAccount={data?.virtualAccountInfo || ''}
          dueAt={data?.virtualAccountDueDate || ''}
          receiptUrl={data?.receiptUrl || ''}
          canceledAt={data?.canceledAt || ''}
        />

        {/* 환불 가격 */}
        {data?.constPaymentStatus === 'CANCELED' && (
          <PaymentCancelPriceItem cancelPrice={data?.cancelPrice || 0} />
        )}

        {/* 환불 + 가상 계좌 결제 */}
        {data?.constPaymentStatus === 'CANCELED' &&
          data?.constPaymentMethod === 'virtual_account' && (
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
          onClick={() =>
            router.push(`/mypage/payments-history?tab=reading_kit`)
          }
          buttonType="outlined"
          text="목록"
          textClassName="font-body1 text-gray-700"
        ></CButton>
      </div>
    </div>
  );
};

export default KitDetailView;
