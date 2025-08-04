'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import ReviewList from '../../../community/review/_components/review-list';

import { useContent } from './useContent';

import CButton from '@/components/shared/CButton';
import CountLayout from '@/components/shared/CountLayout';
import { Loading } from '@/components/shared/Loading';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import { Icons } from '@/components/shared/icons';
import NoData from '@/components/shared/no-data';
import { ContentMyPageHeaderDetail } from '@/components/shared/page-headers/ContentMyPageHeader';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mypageReviewListKey } from '@/constants/queryKeys';
import { useDeleteMyReviews } from '@/hooks/auth/mypage/review/useDeleteMyReviews';
import { useGetMyReviewList } from '@/hooks/auth/mypage/review/useGetMyReivewList';
import { useAlert } from '@/hooks/useAlert';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { getConstantLabel } from '@/lib/utils';

const MyReviewsView = () => {
  const { tab, onChangeTab, page, pageSize } = useContent();
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const alert = useAlert();
  const { mutateAsync: deleteReviews } = useDeleteMyReviews();
  const queryClient = useQueryClient();

  const { data: myReviewListData, isLoading } = useGetMyReviewList({
    constReviewCategory: tab,
    page: String(page),
    size: String(pageSize),
  });

  // 상위 카테고리
  const { constants: reviewCategory } = useSpecificConstant(
    'const_review_category',
  );

  // 하위 카테고리 (좋은책 고르기)
  const { constants: reviewGoodSubCategory } = useSpecificConstant(
    'const_review_goodbook_sub_category',
  );

  // 하위 카테고리 (독서 프로그램)
  const { constants: reviewProgramSubCategory } = useSpecificConstant(
    'const_review_program_sub_category',
  );

  // 하위 카테고리 (기타)
  const { constants: reviewEtcSubCategory } = useSpecificConstant(
    'const_review_etc_sub_category',
  );

  const router = useRouter();

  const reviews = myReviewListData?.data?.content;

  // 개별 리뷰 체크박스 토글
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedReviews((prev) => [...prev, id]);
    } else {
      setSelectedReviews((prev) => prev.filter((reviewId) => reviewId !== id));
    }
  };

  // 전체 선택/해제 토글
  const toggleSelectAll = () => {
    if (selectAll) {
      // 전체 해제
      setSelectedReviews([]);
    } else {
      // 전체 선택
      const allReviewIds = reviews?.map((review) => review.uuid) || [];
      setSelectedReviews(allReviewIds);
    }
    setSelectAll(!selectAll);
  };

  // 선택한 리뷰 삭제
  const handleDeleteSelected = async () => {
    if (selectedReviews.length === 0) {
      toast.error('삭제할 후기 글을 선택해주세요.');
      return;
    }

    try {
      await deleteReviews({ uuidList: selectedReviews });
      setSelectedReviews([]);
      setSelectAll(false);
      toast.success('삭제가 완료되었습니다.');
      queryClient.invalidateQueries({
        queryKey: [mypageReviewListKey],
      });
    } catch (error) {
      console.error('Failed to delete reviews:', error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="default-layout-content">
      <ContentMyPageHeaderDetail
        title={'작성한 후기'}
        onClick={() => router.push('/mypage')}
      />

      <div className="mt-[64px]">
        <Tabs value={tab} onValueChange={onChangeTab}>
          <TabsList className="no-scrollbar flex overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="whole">전체</TabsTrigger>
            {reviewCategory.map((item) => (
              <TabsTrigger key={String(item.value)} value={String(item.value)}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-5">
        <CountLayout count={myReviewListData?.data.page.totalElements} />
      </div>

      {myReviewListData?.data.page.totalElements === 0 ? (
        <NoData />
      ) : (
        <div>
          {reviews?.map((review, index) => (
            <div key={index} className="border-b border-gray-200">
              <div className="flex w-full gap-2">
                <Link
                  href={`/community/review/${review.uuid}`}
                  className="w-full"
                >
                  <ReviewList
                    uuid={review.uuid}
                    title={review.title}
                    commentCounting={review.commentCounting}
                    date={review.createdAt}
                    category={
                      getConstantLabel(
                        reviewCategory,
                        review.constReviewCategory,
                      ) ?? ''
                    }
                    subCategory={(() => {
                      // 상위 카테고리에 따라 적절한 하위 카테고리 선택
                      const category =
                        getConstantLabel(
                          reviewCategory,
                          review.constReviewCategory,
                        ) ?? '';
                      if (
                        category === '좋은책 고르기' &&
                        review.constReviewGoodbookSubCategory
                      ) {
                        // 좋은책 고르기
                        return (
                          getConstantLabel(
                            reviewGoodSubCategory,
                            review.constReviewGoodbookSubCategory,
                          ) ?? ''
                        );
                      } else if (
                        category === '독서프로그램' &&
                        review.constReviewProgramSubCategory
                      ) {
                        // 독서 프로그램
                        return (
                          getConstantLabel(
                            reviewProgramSubCategory,
                            review.constReviewProgramSubCategory,
                          ) ?? ''
                        );
                      } else if (
                        category === '기타' &&
                        review.constReviewEtcSubCategory
                      ) {
                        // 기타
                        return (
                          getConstantLabel(
                            reviewEtcSubCategory,
                            review.constReviewEtcSubCategory,
                          ) ?? ''
                        );
                      }
                      return '';
                    })()}
                    hasFile={review.hasFile}
                    isCheckBoxShow
                    onCheckChange={handleCheckboxChange}
                    isChecked={selectedReviews.includes(review.uuid)}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-1 py-4">
        <div className="flex items-center gap-2" onClick={toggleSelectAll}>
          {selectAll ? (
            <Icons.check_box className="h-m w-m fill-gray-700" />
          ) : (
            <Icons.check_box_outline_blank className="h-m w-m fill-gray-300" />
          )}
          <span className="font-body1 text-gray-400">전체선택</span>
        </div>
        <CButton
          text="선택 삭제"
          buttonType="subtle"
          size="small"
          onClick={() => {
            if (selectedReviews.length === 0) {
              toast.error('삭제할 후기 글을 선택해주세요.');
              return;
            }
            alert({
              icon: 'info',
              title: '후기를 삭제하면 포인트가 차감됩니다.',
              description: (
                <div className="flex w-full flex-col items-center">
                  <span className="font-body1 text-center text-gray-500">
                    작성한 후기를 삭제하면 지급받은 씨앗 포인트가 회수됩니다.
                    삭제 후 복구할 수 없습니다. 계속하시겠습니까?
                  </span>
                </div>
              ),
              cancelText: '취소',
              cancelButton: {
                className: 'w-full',
              },
              confirmText: '삭제',
              confirmButton: {
                className: 'w-full',
              },
              onConfirm: () => {
                handleDeleteSelected();
              },
            });
          }}
        />
      </div>

      {myReviewListData?.data.page.totalElements > 0 && (
        <div className="mt-[56px]">
          <PaginationWithLinks
            pageSize={pageSize}
            totalCount={myReviewListData?.data.page.totalElements}
            size={2}
          />
        </div>
      )}
    </div>
  );
};

export default MyReviewsView;
