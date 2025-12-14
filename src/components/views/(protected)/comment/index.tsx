'use client';

import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

import CommentItem from './_components/comment-item';

import { Loading } from '@/components/shared/Loading';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetCommentList } from '@/hook/comment/useGetCommentList';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';

interface TProps {
  uuid: string;
}

const CommentComponent: FC<TProps> = (props) => {
  const { uuid } = props;
  const router = useRouter();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isFetched,
    isError,
    error,
  } = useGetCommentList({
    id: uuid,
    size: '10',
    sort: 'createdAt,desc',
  });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  if (isLoading) return <Loading />;

  console.log({
    isLoading,
    isFetching,
    isFetched,
    isError,
    error,
    data,
  });

  return (
    <div className="w-full bg-white px-4">
      <Header
        title="댓글"
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
      />
      <div className="mt-4 flex flex-col gap-4">
        {data?.content.map((item) => <CommentItem key={item.id} item={item} />)}

        {data?.paging.totalElements === 0 && (
          <p className="font-s-2 text-center text-gray-04">
            아직 남겨진 댓글이 없어요 <br />
            마음에 스친 생각을 남겨주세요.
          </p>
        )}
        <div ref={observerRef}>{isFetchingNextPage && <Loading />}</div>
      </div>
    </div>
  );
};

export default CommentComponent;
