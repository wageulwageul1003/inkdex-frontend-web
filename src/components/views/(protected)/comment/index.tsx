'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';

import CommentItem from './_components/comment-item';
import { commentSchema } from './schema';

import { Loading } from '@/components/shared/Loading';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetCommentList } from '@/hooks/comment/useGetCommentList';
import { usePostComment } from '@/hooks/comment/usePostComment';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

interface TProps {
  uuid: string;
}

const CommentComponent: FC<TProps> = (props) => {
  const { uuid } = props;
  const router = useRouter();
  const { mutateAsync: postComment } = usePostComment();
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

  const form = useForm({
    resolver: zodResolver(commentSchema),
    mode: 'onSubmit',
    defaultValues: {
      publicId: uuid,
      content: '',
    },
  });

  const onSubmit = async () => {
    try {
      const response = await postComment(form.getValues());
    } catch (error) {}
  };

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
    <div className="flex w-full flex-col bg-white px-4">
      <Header
        title="댓글"
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
      />
      <div className="mt-4 flex flex-1 flex-col gap-4">
        {data?.paging.totalElements === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-s-2 text-center text-gray-04">
              아직 남겨진 댓글이 없어요 <br />
              마음에 스친 생각을 남겨주세요.
            </p>
          </div>
        ) : (
          <div>
            {data?.content.map((item) => (
              <CommentItem key={item.id} item={item} />
            ))}
            <div ref={observerRef}>{isFetchingNextPage && <Loading />}</div>
          </div>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="flex gap-1 py-2 pb-3"
        >
          <FormFields
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="content"
            placeholder="댓글을 남겨보세요"
            className="flex-1"
          />
          <Button
            variant="contained"
            size="lg"
            type="submit"
            disabled={!form.formState.isValid}
          >
            등록
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentComponent;
