'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Loading } from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/views/(public)/home/_components/Card';
import { IMyPostsResponse, useGetMyPosts } from '@/hook/auth/useGetMyPosts';
import { useGetMyProfile } from '@/hook/auth/useGetMyProfile';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';
import { IResponsePaged } from '@/types/global';

export const MyIndexComponent = () => {
  const { data: myProfile } = useGetMyProfile();
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMyPosts({
      category: '',
      size: '10',
      sort: 'createdAt,desc',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-b-4 border-gray-200 pb-4 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-gray-300">
            <Image
              src={myProfile?.profileImageUrl || '/default-profile.png'}
              alt="profile-image"
              width={56}
              height={56}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="font-medium">{myProfile?.nickname}</span>

            <div className="flex items-center gap-2">
              <p className="text-black">
                게시물 <span>{myProfile?.followerCount}</span>
              </p>
              <p className="text-black">
                팔로워 <span>{myProfile?.followerCount}</span>
              </p>
              <p className="text-black">
                팔로잉 <span>{myProfile?.followingCount}</span>
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="outline">
          프로필 편집
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {data?.pages?.map(
          (page: IResponsePaged<IMyPostsResponse>, i: number) => (
            <React.Fragment key={i}>
              {page.data.content.map((item: IMyPostsResponse) => (
                <div
                  key={item.publicId}
                  onClick={() => router.push(`/posts/${item.publicId}`)}
                >
                  <Card
                    ratio={item.aspectRatio}
                    key={item.publicId}
                    nickname={item.userNickname}
                    viewCounting={item.viewCount}
                    nicknameSrc={item.thumbnailUrl || ''}
                    src={item.thumbnailUrl}
                  />
                </div>
              ))}
            </React.Fragment>
          ),
        )}
        <div ref={observerRef}>{isFetchingNextPage && <Loading />}</div>
      </div>
    </div>
  );
};
