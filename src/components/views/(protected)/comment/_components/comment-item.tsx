import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { FC, useState } from 'react';

import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import { Divider } from '@/components/shared/divider';
import { Icons } from '@/components/shared/icons';
import FavoriteToggle from '@/components/shared/post-toggle/favorite-toggle';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { USER_UUID } from '@/constants/tokens';
import { ICommentItemResponse } from '@/hooks/comment/useGetCommentList';
import { useDeleteCommentLike } from '@/hooks/posts/like/useDeleteCommentLike';
import { usePostCommentLike } from '@/hooks/posts/like/usePostCommentLike';
import { usePostReport } from '@/hooks/report/usePostReport';

interface TProps {
  item: ICommentItemResponse;
  selectedComment?: string;
  setSelectedComment?: (commentUuid: string) => void;
  variant: 'reply' | 'post';
}

const CommentItem: FC<TProps> = ({ item, setSelectedComment, variant }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [reportAlertOpen, setReportAlertOpen] = useState(false);

  const isMyComment = item.user.uuid === Cookies.get(USER_UUID);

  // 좋아요
  const { mutateAsync: postCommentLike } = usePostCommentLike();
  const { mutateAsync: deleteCommentLike } = useDeleteCommentLike();

  // 신고
  const { mutateAsync: postReport } = usePostReport();

  const handleLike = (currentLike: boolean, id: string) => {
    // if (!currentLike) {
    //   postCommentLike({ commentUuid: id });
    // } else {
    //   deleteCommentLike({ commentUuid: id });
    // }
  };

  const handleReport = () => {
    setMoreOpen((prev) => !prev);
    setReportAlertOpen(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-03">
          <Image
            src={item.user.profileImageUrl || '/default-profile.png'}
            alt=""
            width={16}
            height={16}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex flex-1 gap-1">
            <p className="font-s-1 text-gray-09">{item.user.nickname}</p>
            {isMyComment && (
              <p className="border-gra-03 font-xs-2 h-fit w-fit rounded-sm border px-1 py-[2px] text-gray-05">
                작성자
              </p>
            )}
          </div>
          <p className="font-xs-2 flex-1 text-gray-05">
            {dayjs(item.createdAt).format('YYYY-MM-DD HH:MM')}
          </p>
        </div>
        {!isMyComment && (
          <div className="relative">
            <Button
              onClick={() => setMoreOpen((prev) => !prev)}
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
            >
              <Icons.moreHoriz className="size-6 fill-gray-08" />
            </Button>

            {moreOpen && (
              <div
                className="absolute right-0 top-full z-10 mt-1 flex h-11 w-[132px] items-center justify-center rounded-lg border border-gray-03 bg-white text-center"
                onClick={handleReport}
              >
                <p className="font-m-2 text-gray-08">댓글 신고하기</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="ml-10 flex flex-col gap-2">
        <p className="font-s-2 text-gray-08">{item.content}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 py-1">
            <FavoriteToggle
              defaultFavorite={item.isLiked}
              onToggle={() => handleLike(item.isLiked, item.id)}
            />
            <p className="font-xs-2 text-gray-08">{item.likesCount}</p>
          </div>
          {variant === 'post' && (
            <div className="flex items-center gap-2">
              <Divider />

              <p
                className="font-xs-2 cursor-pointer text-gray-08"
                onClick={() => setSelectedComment?.(item.uuid)}
              >
                답글 달기
              </p>
            </div>
          )}
        </div>
      </div>

      <CustomAlertDialog
        isOpen={reportAlertOpen}
        onOpenChange={setReportAlertOpen}
        title="댓글을 신고할까요?"
        description={
          <p>
            신고한 댓글은 운영 정책에 따라 검토됩니다. <br />
            신고 후에는 취소할 수 없어요.
          </p>
        }
        cancelText="닫기"
        confirmText="신고하기"
        onConfirm={() => {
          postReport({
            targetUuid: item.uuid || '',
            type: 'COMMENT',
          }).then(() => {
            setReportAlertOpen(false);
            toast.success('신고가 접수되었어요!');
          });
        }}
      />
    </div>
  );
};

export default CommentItem;
