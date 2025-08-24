'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { TWriteSchema, writeSchema } from './schema';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Form } from '@/components/ui/form';
import { SELECTED_IMAGE } from '@/constants/tokens';
import { usePostPosts } from '@/hook/posts/usePostPosts';

interface TProps {
  uuid: string;
}

export const PostsWrite: FC<TProps> = (props) => {
  const { uuid } = props;
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { mutateAsync: postPosts } = usePostPosts();

  // 컴포넌트 마운트 시 localStorage에서 이미지 데이터 가져오기
  useEffect(() => {
    try {
      const storedImage = sessionStorage.getItem(SELECTED_IMAGE);
      if (storedImage) {
        setImage(storedImage);
      }
    } catch (error) {
      console.error('이미지 데이터 로드 실패:', error);
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(writeSchema),
    mode: 'onChange',
    defaultValues: {
      image: image || '',
      categorySlug: 'novel',
      content: '123123',
      tags: ['123', '123'],
    },
  });

  const onSubmit = async (data: TWriteSchema) => {
    try {
      setIsSubmitting(true);
      console.log('제출 데이터:', data);
      await postPosts(data);
      toast.success('게시물이 성공적으로 등록되었습니다.');
      router.push('/home'); // 게시물 목록 페이지로 이동
    } catch (error) {
      console.error('게시물 등록 오류:', error);
      toast.error('게시물 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <Header
        left={
          <Icons.close
            className="size-6 fill-black"
            onClick={() => router.back()}
          />
        }
        title={<span>글쓰기</span>}
        right={
          isSubmitting ? (
            <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
          ) : (
            <Icons.pencil
              className="size-6 fill-black"
              onClick={form.handleSubmit(onSubmit)}
            />
          )
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="mt-6"
        >
          <Image
            src={image || '/default-image.png'}
            alt="post-image"
            width={100}
            height={100}
            className="w-full rounded-[24px]"
          />
        </form>
      </Form>
    </div>
  );
};
