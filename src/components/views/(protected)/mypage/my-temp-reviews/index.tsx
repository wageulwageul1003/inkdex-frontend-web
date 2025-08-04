'use client';

import { useQueryClient } from '@tanstack/react-query';
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
import { mypageReviewTempListKey } from '@/constants/queryKeys';
import { useDeleteMyTempReviews } from '@/hooks/auth/mypage/my-temp-reviews/useDeleteMyTempReviews';
import { useGetMyTempReivewList } from '@/hooks/auth/mypage/my-temp-reviews/useGetMyTempReivewList';
import { useAlert } from '@/hooks/useAlert';
import { useSpecificConstant } from '@/hooks/useGetConstant';
import { getConstantLabel } from '@/lib/utils';

const MyTempReviewsView = () => {
  const { tab, onChangeTab, page, pageSize } = useContent();
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const alert = useAlert();
  const { mutateAsync: deleteMyTempReviews } = useDeleteMyTempReviews();
  const queryClient = useQueryClient();

  const { data: reviewList, isLoading } = useGetMyTempReivewList({
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

  // 하위 카테고리 모음집
  const reviewSubCategory = [
    ...reviewGoodSubCategory,
    ...reviewProgramSubCategory,
    ...reviewEtcSubCategory,
  ];

  const reviews = reviewList?.data?.content;

  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

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
      await deleteMyTempReviews({ uuidList: selectedReviews });
      setSelectedReviews([]);
      setSelectAll(false);
      toast.success('선택한 임시보관글이 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: [mypageReviewTempListKey],
      });
    } catch (error) {
      console.error('Failed to delete reviews:', error);
    }
  };

  return (
    <div className="default-layout-content">
      <ContentMyPageHeaderDetail
        title={'임시 보관함'}
        onClick={() => router.push('/mypage')}
      />

      <div className="mt-[64px]">
        <Tabs value={tab} onValueChange={onChangeTab}>
          <TabsList className="no-scrollbar flex overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="whole">전체</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-5">
        <CountLayout count={reviewList?.data.page.totalElements} />
      </div>

      {reviewList?.data.page.totalElements === 0 ? (
        <NoData />
      ) : (
        <div>
          {reviews?.map((review, index) => (
            <div className="border-b border-gray-200">
              <ReviewList
                uuid={review.uuid}
                title={review.title}
                date={review.createdAt}
                category={
                  getConstantLabel(
                    reviewCategory,
                    review.constReviewCategory,
                  ) ?? ''
                }
                subCategory={
                  getConstantLabel(
                    reviewSubCategory,
                    review.constReviewSubCategory,
                  ) ?? ''
                }
                hasFile={false}
                isCheckBoxShow
                isChecked={selectedReviews.includes(review.uuid)}
                onCheckChange={handleCheckboxChange}
                isCommentShow={false}
              />
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
              title: '선택한 임시보관글을 삭제하시겠습니까?',
              description: (
                <div className="flex w-full flex-col items-center">
                  <span className="font-body1 text-center text-gray-500">
                    삭제하신 임시보관글은 복구가 어렵습니다. 계속
                    진행하시겠어요?
                  </span>
                </div>
              ),
              cancelText: '취소',
              cancelButton: {
                className: 'w-full',
              },
              confirmText: '삭제하기',
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

      {reviewList?.data.page.totalElements > 10 && (
        <div className="mt-[56px]">
          <PaginationWithLinks
            pageSize={pageSize}
            totalCount={reviewList?.data.page.totalElements}
            size={2}
          />
        </div>
      )}
    </div>
  );
};

export default MyTempReviewsView;
