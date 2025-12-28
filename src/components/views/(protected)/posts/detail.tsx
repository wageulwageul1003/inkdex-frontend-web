'use client';

import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { TypeItemComponent } from '../../(public)/home/_components/WriteType';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { USER_ID } from '@/constants/tokens';
import { useGetCategoryLabel } from '@/hook/common/useGetCategoryLabel';
import { useDeleteFollow } from '@/hook/follow/useDeleteFollow';
import { usePostFollow } from '@/hook/follow/usePostFollow';
import { useGetPostsDetail } from '@/hook/home/useGetPostsDetail';
import { useDeletetBookmark } from '@/hook/posts/bookmark/useDeletetBookmark';
import { usePostBookmark } from '@/hook/posts/bookmark/usePostBookmark';

interface TProps {
  uuid: string;
}

const editTypeItems = [
  {
    value: 'edit',
    label: '수정',
    onClick: () => {},
  },
  {
    value: 'delete',
    label: '삭제',
    onClick: () => {},
  },
];

export const PostsDetail: FC<TProps> = (props) => {
  const { uuid } = props;
  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const { data } = useGetPostsDetail(uuid);

  // 북마크
  const { mutateAsync: postBookmark } = usePostBookmark();
  const { mutateAsync: deleteBookmark } = useDeletetBookmark();

  // 팔로우
  const { mutateAsync: postFollow } = usePostFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();
  const router = useRouter();

  const handleBookmark = () => {
    if (!data?.bookmarked) {
      postBookmark({ postId: uuid });
    } else {
      deleteBookmark({ postId: uuid });
    }
  };

  const handleFollow = () => {
    if (!data?.bookmarked) {
      postFollow({ publicId: data?.userPublicId ?? '' });
    } else {
      deleteFollow({ publicId: data?.userPublicId ?? '' });
    }
  };

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
          <div
            className="flex items-center gap-[6px]"
            onClick={() =>
              data?.userPublicId === Cookies.get(USER_ID)
                ? router.push(`/mypage`)
                : router.push(`/other-profile/${data?.userPublicId}`)
            }
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
              <Image
                src={'/default-profile.png'}
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
            <Button
              onClick={() => {
                setOpen(true);
              }}
              size="default"
              variant="default"
              className="px-3 py-2"
            >
              편집
            </Button>
          ) : (
            <Button
              onClick={() => handleFollow()}
              size="default"
              variant="default"
              className="px-3 py-2"
            >
              <Icons.plus className="size-6" />
              팔로우
            </Button>
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
            <Icons.bell className="size-6" />
            {data?.likeCount && data?.likeCount > 9999
              ? '9999+'
              : data?.likeCount || 0}
          </p>
          <p
            className="flex items-center gap-1 text-gray-500"
            onClick={() => setCommentOpen(true)}
          >
            <Icons.bell className="size-6" />
            {data?.commentCount && data?.commentCount > 9999
              ? '9999+'
              : data?.commentCount || 0}
          </p>
          <Icons.bookmark
            onClick={() => {
              handleBookmark();
            }}
            className={`size-6 ${data?.bookmarked ? 'fill-black stroke-black' : 'fill-white stroke-black'}`}
          />
          {data?.userPublicId !== Cookies.get('userPublicId') && (
            <Icons.bell className="size-6 fill-black stroke-black" />
          )}
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom">
          <div className="w-full">
            <SheetTitle className="pt-7 text-center">
              <span>게시글 편집</span>
            </SheetTitle>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {editTypeItems.map((item) => (
              <TypeItemComponent
                key={item.value}
                {...item}
                onClick={() => item.onClick()}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={commentOpen} onOpenChange={setCommentOpen}>
        <SheetContent side="bottom">
          <p>111</p>
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
          >
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Sidebar</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </ResizablePanelGroup>
        </SheetContent>
      </Sheet>
    </div>
  );
};
