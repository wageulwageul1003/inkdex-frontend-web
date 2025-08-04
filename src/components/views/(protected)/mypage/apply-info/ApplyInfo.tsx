import { useSearchParams } from 'next/navigation';
import React from 'react';

import DigitalItem from '../../program-item/digital-item/_components/DigitalItem';
import FrameItem from '../../program-item/frame-item/_components/FrameItem';
import KitItem from '../../program-item/kit-item/_components/KitItem';
import LectureItem from '../../program-item/lecture-item/_components/LectureItem';

import { useContent } from './useContent';

import CountLayout from '@/components/shared/CountLayout';
import { Loading } from '@/components/shared/Loading';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import NoData from '@/components/shared/no-data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetProgramApplicationList } from '@/hooks/program/application/useGetProgramApplicationList';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import {
  IDigitalProgram,
  IFrameProgram,
  IKitProgram,
  ILectureProgram,
  ProgramType,
} from '@/types/program';

export const renderItemByType = (
  application: ProgramType,
  index: number,
): React.ReactNode => {
  switch (application.programType) {
    case 'lecture':
      return (
        <LectureItem application={application as ILectureProgram} key={index} />
      );
    case 'exhibition':
      return (
        <FrameItem application={application as IFrameProgram} key={index} />
      );
    case 'digital_exhibition':
      return (
        <DigitalItem application={application as IDigitalProgram} key={index} />
      );
    case 'reading_kit':
      return <KitItem application={application as IKitProgram} key={index} />;
    default:
      return null;
  }
};

const ApplyInfo = ({ type }: { type: 'mypage' | 'history' }) => {
  const { constProgramType, onChangeTab, page, pageSize } = useContent();

  const searchParams = useSearchParams();
  const params = {
    page: String(page),
    size: type === 'mypage' ? String(5) : String(10),
    constProgramType: searchParams.get('constProgramType') || 'whole',
  };

  const { data: programApplicationList, isLoading } =
    useGetProgramApplicationList(params);

  // 독서 프로그램 구분
  const { constants: programType } = useSpecificConstant('const_program_type');

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      {type === 'history' && (
        <div className="mt-[64px]">
          <Tabs value={constProgramType} onValueChange={onChangeTab}>
            <TabsList className="no-scrollbar flex overflow-x-auto whitespace-nowrap">
              <TabsTrigger value="whole">전체</TabsTrigger>
              {programType.map((item) => (
                <TabsTrigger
                  key={String(item.value)}
                  value={String(item.value)}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="mt-5">
            <CountLayout
              count={programApplicationList?.data.page.totalElements || 0}
            />
          </div>
        </div>
      )}

      {programApplicationList?.data.page.totalElements === 0 ? (
        <NoData />
      ) : (
        <div className="">
          {programApplicationList?.data.content.map((application, index) => (
            <div
              key={`item-container-${index}`}
              className={
                index === programApplicationList?.data.content.length - 1
                  ? ''
                  : 'border-b border-gray-200'
              }
            >
              {renderItemByType(application, index)}
            </div>
          ))}
        </div>
      )}

      {type === 'history' &&
        programApplicationList?.data.page.totalElements > 0 && (
          <div className="mt-[56px]">
            <PaginationWithLinks
              pageSize={pageSize}
              totalCount={programApplicationList?.data.page.totalElements || 0}
              size={2}
            />
          </div>
        )}
    </div>
  );
};

export default ApplyInfo;
