'use client';

import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { USER_ID } from '@/constants/tokens';
import { useGetCategoryLabel } from '@/hook/common/useGetCategoryLabel';
import { useGetPostsDetail } from '@/hook/home/useGetPostsDetail';

interface TProps {
  uuid: string;
}

export const PostsDetail: FC<TProps> = (props) => {
  const { uuid } = props;
  const { data } = useGetPostsDetail(uuid);
  const router = useRouter();
  return (
    <div className="flex w-full flex-col">
      <Header
        left={
          <Icons.keyboardArrowLeft
            className="size-6 fill-black"
            onClick={() => router.back()}
          />
        }
        title={
          <div className="flex items-center gap-[6px]">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
              <Image
                src={data?.profileImageUrl || '/default-profile.png'}
                alt="profile-image"
                width={16}
                height={16}
              />
            </div>
            <span className="font-medium">{data?.userNickname}</span>
          </div>
        }
        right={
          data?.userPublicId === Cookies.get(USER_ID) ? (
            <p>편집</p>
          ) : (
            <p>팔로우</p>
          )
        }
      />

      <div className="flex w-full flex-1 flex-col">
        <div className="flex h-full flex-1 flex-col">
          <Image
            src={data?.imageUrl || '/default-image.png'}
            alt="post-image"
            width={100}
            height={100}
            className="w-full rounded-[24px]"
          />

          <div className="mt-5 flex items-center gap-2 border-b border-gray-300 pb-5">
            <p className="text-black">
              {useGetCategoryLabel(data?.categorySlug || '')}
            </p>
            <p className="text-gray-500">
              {dayjs(data?.createdAt).format('YYYY년 MM월 DD일 HH:mm')}
            </p>
          </div>

          <p className="mt-5">{data?.content}</p>

          <div className="mt-4 flex items-center gap-1">
            {data?.tags.map((tag) => (
              <span key={tag} className="text-green-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between p-5">
          <p className="flex items-center gap-1 text-gray-500">
            <Icons.like className="size-6" />
            {data?.likeCount && data?.likeCount > 9999
              ? '9999+'
              : data?.likeCount || 0}
          </p>
          <p className="flex items-center gap-1 text-gray-500">
            <Icons.message className="size-6" />
            {data?.commentCount && data?.commentCount > 9999
              ? '9999+'
              : data?.commentCount || 0}
          </p>
          <Icons.bookmark className="size-6" />
          {data?.userPublicId !== Cookies.get('userPublicId') && (
            <Icons.report className="size-6 fill-black stroke-black" />
          )}
        </div>
      </div>
    </div>
  );
};
