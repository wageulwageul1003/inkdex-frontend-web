'use client';

import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail';
import Image from 'next/image';
import FavoriteToggle from '@/components/shared/post-toggle/favorite-toggle';
import dayjs from 'dayjs';
import { VISIBILITY } from '@/constants/enum';
import { Button } from '@/components/ui/button';
import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import { useDeletePost } from '@/hooks/posts/useDeletePost';
import { toast } from '@/components/ui/sonner';

interface TProps {
  postUuid: string;
}

export const PostsDetail: FC<TProps> = ({ postUuid }: TProps) => {
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const { data } = useGetPostDetail(postUuid);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { mutateAsync: deletePost } = useDeletePost();

  const selectedItem = VISIBILITY.find(
    (item) => item.value === data?.data.visibility,
  );

  const handleDeletePost = () => {
    deletePost(postUuid).then(() => {
      router.back();
      toast.success('게시물 삭제가 완료되었어요.');
    });
  };

  return (
    <div className="no-scrollbar flex flex-1 flex-col bg-white px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 fill-black"
            onClick={() => router.back()}
          />
        }
        right={
          <div className="relative">
            <Button
              onClick={() => setMoreOpen((prev) => !prev)}
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
            >
              <Icons.moreHoriz className="size-6 fill-gray-08" />
            </Button>

            {moreOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 flex w-[104px] flex-col items-center rounded-lg border border-gray-03 bg-white text-center">
                <p
                  className="font-m-2 flex h-11 items-center px-2 text-gray-08"
                  onClick={() => router.push(`/posts/${postUuid}/edit`)}
                >
                  편집
                </p>
                <p
                  className="font-m-2 flex h-11 items-center px-2 text-red-05"
                  onClick={() => {
                    setDeleteAlertOpen(true);
                    setMoreOpen(false);
                  }}
                >
                  삭제
                </p>
              </div>
            )}
          </div>
        }
      />

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-03">
        <Image
          src={data?.data.imageUrl || '/default-image.png'}
          alt={data?.data?.source || ''}
          fill
          className="object-cover"
        />
      </div>

      <div className="items-center justify-between px-1">
        <p className="font-m-1 text-gray-09">{data?.data.source}</p>
        <FavoriteToggle />
      </div>

      <div className="flex flex-col gap-3 px-1">
        <p className="font-s-2 text-black- mt-3">{data?.data.reflection}</p>
        <p className="font-xs-2 py-1 text-gray-05">
          {dayjs(data?.data.createdAt).format('YYYY-MM-DD')}
        </p>
      </div>

      <div className="mt-6 pt-6">
        <p className="font-s-1 text-gray-08">컬렉션</p>
        <div className="flex flex-wrap gap-2">
          {data?.data.collections.map((item) => (
            <div
              key={item.uuid}
              className="flex items-center gap-2 py-2 pl-2 pr-3"
            >
              <div className="h-6 w-6 shrink-0 rounded-md border border-gray-03">
                <Image
                  src={item.imageUrl || '/default-image.png'}
                  alt={item.name}
                  width={24}
                  height={24}
                />
              </div>
              <span className="font-xs-2 line-clamp-1 flex-1 text-gray-09">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pb-20">
        <p className="font-s-1 text-gray-08">공개 범위</p>
        {selectedItem && (
          <div className="mt-3 flex items-center gap-1 px-4">
            {selectedItem.icon}
            <span className="font-m-2 text-gray-08">{selectedItem.label}</span>
          </div>
        )}
      </div>

      <CustomAlertDialog
        isOpen={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        title="이 게시물을 삭제할까요?"
        description={<p>삭제 후에는 복구할 수 없어요.</p>}
        cancelText="아니오"
        confirmText="예"
        onConfirm={handleDeletePost}
      />
    </div>
  );
};
