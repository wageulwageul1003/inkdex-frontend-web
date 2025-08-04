import {
  MyPageHeaderInfoTitle,
  MyPageHeaderSubTitle,
} from '@/components/shared/page-headers/ContentMyPageHeader';
import { IFile } from '@/types/global';

const DocumentItem = ({
  requestDocuments,
  businessRegistration,
  taxInvoiceEmail,
}: {
  requestDocuments?: string;
  businessRegistration?: IFile;
  taxInvoiceEmail?: string;
}) => {
  return (
    requestDocuments !== '' ||
    businessRegistration?.originalName !== '' ||
    (taxInvoiceEmail !== '' && (
      <div className="flex flex-col gap-4">
        <MyPageHeaderInfoTitle title="서류 요청" modify={false} />

        <div className="flex flex-col gap-6 lg:gap-3">
          <MyPageHeaderSubTitle
            subTitle="요청 서류"
            value={requestDocuments || ''}
          />
        </div>
        <div className="flex flex-col gap-6 lg:gap-3">
          <MyPageHeaderSubTitle
            subTitle="사업자 등록증"
            value={businessRegistration?.originalName || ''}
            downloadLink={businessRegistration?.link || ''}
          />
        </div>
        <div className="flex flex-col gap-6 lg:gap-3">
          <MyPageHeaderSubTitle
            subTitle="세금 계산서 이메일"
            value={taxInvoiceEmail}
          />
        </div>
      </div>
    ))
  );
};

export default DocumentItem;
