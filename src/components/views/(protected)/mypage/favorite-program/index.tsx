'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { useContent } from './useContent';

import CountLayout from '@/components/shared/CountLayout';
import { Loading } from '@/components/shared/Loading';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import CardProgram1 from '@/components/shared/cards/card-program/card-program1/CardProgram1';
import CardProgram2 from '@/components/shared/cards/card-program/card-program2/CardProgram2';
import CardProgram3 from '@/components/shared/cards/card-program/card-program3/CardProgram3';
import NoData from '@/components/shared/no-data';
import { ContentMyPageHeaderDetail } from '@/components/shared/page-headers/ContentMyPageHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetWishList } from '@/hooks/auth/wish/useGetWishList';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';
import { cn } from '@/lib/utils';

const FavoriteProgramView = () => {
  const { tab, onChangeTab, page, pageSize } = useContent();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: wishListData, isLoading } = useGetWishList({
    constWishTarget: tab,
    page: String(page),
    size: String(pageSize),
    subcategory: searchParams.get('subcategory') || '',
  });

  const { constants: wishTarget } = useSpecificConstant('const_wish_target');
  const wishTargetLabel = useGetConstantLabel(wishTarget, tab);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="default-layout-content">
      <ContentMyPageHeaderDetail
        title={'관심 프로그램'}
        onClick={() => router.push('/mypage')}
      />

      <div className="mt-[64px]">
        <Tabs value={tab} onValueChange={onChangeTab}>
          <TabsList className="no-scrollbar flex overflow-x-auto whitespace-nowrap">
            {wishTarget
              .filter(
                (item) =>
                  item.label === '강연 및 행사' ||
                  item.label === '액자 전시' ||
                  item.label === '디지털 전시' ||
                  item.label === '독서 활동 키트',
              )
              .map((item) => (
                <TabsTrigger
                  key={String(item.value)}
                  value={String(item.value)}
                >
                  {item.label}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-5">
        <CountLayout count={wishListData?.data.page.totalElements || 0} />
      </div>

      {wishListData?.data.page.totalElements === 0 ? <NoData /> : <></>}

      {wishTargetLabel === '강연 및 행사' ? (
        <div
          className={cn(
            `mt-5 grid grid-cols-1 gap-y-8`,
            `md:grid-cols-2 md:gap-x-4`,
            `lg:grid-cols-4 lg:gap-x-6`,
          )}
        >
          {wishListData?.data.content.map((program, index) => (
            <div
              key={index}
              onClick={() => router.push(`/program/lecture/${program.uuid}`)}
            >
              <CardProgram1
                isFixed={false}
                defaultFavorite={program.isWish}
                src={program.file?.link}
                title={program.title}
                author={program.author ?? ''}
                isNonFace={program.isOnline ?? false}
                publisher={program.publisher ?? ''}
                constLectureType={program.constLectureType ?? ''}
                constRecommendTarget={program.constRecommendTarget ?? ''}
                constProgramSubjectList={program.constProgramSubjectList ?? []}
                uuid={program.uuid}
                constWishTarget={'lecture'}
              />
            </div>
          ))}
        </div>
      ) : wishTargetLabel === '액자 전시' ? (
        <>
          <div
            className={cn(
              `mt-5 grid grid-cols-1 gap-y-8`,
              `md:grid-cols-2 md:gap-x-4`,
              `lg:grid-cols-4 lg:gap-x-6`,
            )}
          >
            {wishListData?.data.content.map((program, index) => (
              <div
                key={index}
                onClick={() => router.push(`/program/frame/${program.uuid}`)}
              >
                <CardProgram2
                  uuid={program.uuid}
                  isFixed={false}
                  isClosed={program.isClosed ?? false}
                  defaultFavorite={program.isWish}
                  src={program.file?.link}
                  title={program.title}
                  author={program.author ?? ''}
                  publisher={program.publisher ?? ''}
                  constRecommendTarget={program.constRecommendTarget ?? ''}
                  subjectWord={program.subjectWord ?? ''}
                  quantity={program.quantity ?? 0}
                  constWishTarget={'exhibition'}
                />
              </div>
            ))}
          </div>
        </>
      ) : wishTargetLabel === '디지털 전시' ? (
        <div
          className={cn(
            `mt-5 grid grid-cols-1 gap-y-8`,
            `md:grid-cols-2 md:gap-x-4`,
            `lg:grid-cols-4 lg:gap-x-6`,
          )}
        >
          {wishListData?.data.content.map((program, index) => (
            <div
              key={index}
              onClick={() => router.push(`/program/digital/${program.uuid}`)}
            >
              <CardProgram2
                isFixed={false}
                src={program.file.link}
                title={program.title}
                author={program.author ?? ''}
                publisher={program.publisher ?? ''}
                constRecommendTarget={program.constRecommendTarget ?? ''}
                subjectWord={program.subjectWord ?? ''}
                quantity={program.quantity ?? 0}
                defaultFavorite={program.isWish}
                isClosed={program.isClosed ?? false}
                uuid={program.uuid}
                constWishTarget={'digital_exhibition'}
              />
            </div>
          ))}
        </div>
      ) : wishTargetLabel === '독서 활동 키트' ? (
        <div
          className={cn(
            `mt-5 grid grid-cols-1 gap-y-8`,
            `md:grid-cols-2 md:gap-x-4`,
            `lg:grid-cols-4 lg:gap-x-6`,
          )}
        >
          {wishListData?.data.content.map((program, index) => (
            <div
              key={index}
              onClick={() => router.push(`/program/kit/${program.uuid}`)}
            >
              <CardProgram3
                isFixed={false}
                src={program.file.link}
                constPaymentType={program.constPaymentType ?? ''}
                title={program.title}
                constReadingKitType={program.constReadingKitType ?? ''}
                constRecommendTarget={program.constRecommendTarget ?? ''}
                constProgramSubjectList={program.constProgramSubjectList ?? []}
                defaultFavorite={program.isWish}
                isClosed={program.isClosed ?? false}
                uuid={program.uuid}
                constWishTarget={'reading_kit'}
              />
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}

      {wishListData?.data.page.totalElements > 0 && (
        <div className="mt-[32px]">
          <PaginationWithLinks
            pageSize={pageSize}
            totalCount={wishListData?.data.page.totalElements || 0}
            size={2}
          />
        </div>
      )}
    </div>
  );
};

export default FavoriteProgramView;
