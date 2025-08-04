'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useContent } from './useContent';

import CButton from '@/components/shared/CButton';
import CountLayout from '@/components/shared/CountLayout';
import { Loading } from '@/components/shared/Loading';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import CardBook1 from '@/components/shared/cards/card-book/card-book1/CardBook1';
import CardBook2 from '@/components/shared/cards/card-book/card-book2/CardBook2';
import CardBook3 from '@/components/shared/cards/card-book/card-book3/CardBook3';
import NoData from '@/components/shared/no-data';
import { ContentMyPageHeaderDetail } from '@/components/shared/page-headers/ContentMyPageHeader';
import Chips from '@/components/ui/chips';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePostDownloadWishExcel } from '@/hooks/auth/mypage/usePostDownloadWishExcel';
import { useGetWishList } from '@/hooks/auth/wish/useGetWishList';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { useGetConstantLabel } from '@/hooks/useGetLabelValue';
import { cn, getConstantLabel, getEditorPreview } from '@/lib/utils';

const FavoriteBooksView = () => {
  const { tab, onChangeTab, page, pageSize } = useContent();

  const searchParams = useSearchParams();
  const router = useRouter();

  const { mutateAsync: postDownloadWishExcel } = usePostDownloadWishExcel();

  const { data: wishListData, isLoading } = useGetWishList({
    constWishTarget: tab,
    page: String(page),
    size: String(pageSize),
    subcategory: searchParams.get('subcategory') || '',
  });

  const { constants: wishTarget } = useSpecificConstant('const_wish_target');
  const wishTargetLabel = useGetConstantLabel(wishTarget, tab);

  // 큐레이션 카테고리
  const { constants: curationType } = useSpecificConstant(
    'const_curation_type',
  );
  const { constants: readingActivityContentType } = useSpecificConstant(
    'const_reading_activity_content_type',
  );
  const curationTypeWhole = [
    {
      label: '전체',
      value: '전체',
      disabled: false,
    },
    ...curationType,
  ];
  const readingActivityContentTypeWhole = [
    {
      label: '전체',
      value: '전체',
      disabled: false,
    },
    ...readingActivityContentType,
  ];
  const initialCurationType = searchParams.get('subcategory') || '전체';
  const [selectedCurationType, setSelectedCurationType] =
    useState<string>(initialCurationType);
  const initialReadingActivityContentType =
    searchParams.get('subcategory') || '전체';
  const [
    selectedReadingActivityContentType,
    setSelectedReadingActivityContentType,
  ] = useState<string>(initialReadingActivityContentType);

  // 탭이 변경될 때마다 필터 상태 초기화
  useEffect(() => {
    setSelectedCurationType('전체');
    setSelectedReadingActivityContentType('전체');
  }, [tab]);

  const handleCurationTypeSelect = (item: string | string[]) => {
    if (typeof item === 'string') {
      setSelectedCurationType(item);
      updateUrlParams(item);
      setSelectedReadingActivityContentType('전체');
    }
  };

  const handleReadingActivityContentTypeSelect = (item: string | string[]) => {
    if (typeof item === 'string') {
      setSelectedReadingActivityContentType(item);
      updateUrlReadingParams(item);
      setSelectedCurationType('전체');
    }
  };

  const handleSaveExcel = () => {
    postDownloadWishExcel();
  };

  const updateUrlParams = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (item === '전체') {
      params.delete('subcategory');
    } else {
      params.set('subcategory', item);
    }

    router.push(`?${params.toString()}`);
  };

  const updateUrlReadingParams = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (item === '전체') {
      params.delete('subcategory');
    } else {
      params.set('subcategory', item);
    }

    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="default-layout-content">
      <ContentMyPageHeaderDetail
        title={'관심 콘텐츠'}
        onClick={() => router.push('/mypage')}
      />

      <div className="mt-[64px]">
        <Tabs value={tab} onValueChange={onChangeTab}>
          <TabsList className="no-scrollbar flex overflow-x-auto whitespace-nowrap">
            {wishTarget
              .filter(
                (item) =>
                  item.label === '도서' ||
                  item.label === '큐레이션' ||
                  item.label === '독서 활동 자료',
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

      {wishTargetLabel === '큐레이션' && (
        <div className="mt-4">
          <Chips
            items={curationTypeWhole}
            type="scrollable"
            selected={selectedCurationType}
            onChange={handleCurationTypeSelect}
          />
        </div>
      )}

      {wishTargetLabel === '독서 활동 자료' && (
        <div className="mt-4">
          <Chips
            items={readingActivityContentTypeWhole}
            type="scrollable"
            selected={selectedReadingActivityContentType}
            onChange={handleReadingActivityContentTypeSelect}
          />
        </div>
      )}

      <div className="relative mt-5">
        <CountLayout count={wishListData?.data.page.totalElements || 0} />
        {wishTargetLabel === '도서' && (
          <div className="absolute right-0 top-0">
            <CButton
              onClick={handleSaveExcel}
              text="Excel 저장"
              textClassName="font-body1"
              buttonType="outlined"
              size="small"
            />
          </div>
        )}
      </div>

      {wishListData?.data.page.totalElements === 0 ? <NoData /> : <></>}

      {wishTargetLabel === '도서' ? (
        <div
          className={cn(
            `mt-5 grid grid-cols-2 gap-2`,
            `md:grid-cols-4 md:gap-4`,
            `lg:grid-cols-5 lg:gap-6`,
          )}
        >
          {wishListData?.data.content.map((book, index) => (
            <div
              key={index}
              onClick={() => router.push(`/relation-book/${book.uuid}`)}
            >
              <CardBook1
                defaultFavorite={book.isWish}
                src={book.file?.link}
                author={book.author}
                title={book.title}
                uuid={book.uuid}
                constWishTarget="monthly_book_seed"
              />
            </div>
          ))}
        </div>
      ) : wishTargetLabel === '큐레이션' ? (
        <>
          <div
            className={cn(
              `mt-5 grid grid-cols-1 gap-y-8`,
              `md:grid-cols-2 md:gap-x-4`,
              `lg:grid-cols-4 lg:gap-x-6`,
            )}
          >
            {wishListData?.data.content.map((book, index) => (
              <div
                key={index}
                onClick={() => {
                  if (
                    getConstantLabel(curationType, book.subCategory) ===
                    '책씨앗 오리지널'
                  ) {
                    router.push(`/choose-good-book/original/${book.uuid}`);
                  } else if (
                    getConstantLabel(curationType, book.subCategory) ===
                    '작가 큐레이션'
                  ) {
                    router.push(`/choose-good-book/author/${book.uuid}`);
                  } else {
                    router.push(`/choose-good-book/subject/${book.uuid}`);
                  }
                }}
              >
                <CardBook2
                  defaultFavorite={book.isWish}
                  src={book.file?.link}
                  title={book.title}
                  uuid={book.uuid}
                  commentCounting={book.commentCounting}
                  constWishTarget="curation"
                  content={getEditorPreview(book.content || '')}
                  subCategory={getConstantLabel(curationType, book.subCategory)}
                  date={book.createdAt}
                />
              </div>
            ))}
          </div>
        </>
      ) : wishTargetLabel === '독서 활동 자료' ? (
        <div
          className={cn(
            `mt-5 grid grid-cols-1 gap-y-8`,
            `md:grid-cols-2 md:gap-x-4`,
            `lg:grid-cols-4 lg:gap-x-6`,
          )}
        >
          {wishListData?.data.content.map((book, index) => (
            <div
              key={index}
              onClick={() => {
                if (
                  getConstantLabel(
                    readingActivityContentType,
                    book.subCategory,
                  ) === '도서 콘텐츠'
                ) {
                  router.push(`/choose-good-book/content/${book.uuid}`);
                } else if (
                  getConstantLabel(
                    readingActivityContentType,
                    book.subCategory,
                  ) === '독서 지도안 및 활동지'
                ) {
                  router.push(`/choose-good-book/guide/${book.uuid}`);
                }
              }}
            >
              <CardBook3
                defaultFavorite={book.isWish}
                src={book.file?.link}
                title={book.title}
                uuid={book.uuid}
                constWishTarget="reading_activity_content"
                subCategory={getConstantLabel(
                  readingActivityContentType,
                  book.subCategory,
                )}
                date={book.createdAt}
                commentCounting={book.commentCounting}
              />
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}

      {wishListData?.data.page.totalElements > 16 && (
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

export default FavoriteBooksView;
