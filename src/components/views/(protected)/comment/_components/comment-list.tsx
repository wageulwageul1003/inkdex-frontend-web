import { FC, useState } from 'react';

import CommentItem from './comment-item';

import { Loading } from '@/components/shared/Loading';
import {
  ICommentItemResponse,
  ICommentListResponse,
} from '@/hooks/comment/useGetCommentList';
import { useGetCommentReplyList } from '@/hooks/comment/useGetCommentReplyList';
import { useInfiniteScroll } from '@/hooks/common/useInfiniteScroll';

interface TProps {
  item: ICommentListResponse;
  selectedComment: string | null;
  setSelectedComment: (commentId: string | null) => void;
}

const CommentList: FC<TProps> = ({
  item,
  selectedComment,
  setSelectedComment,
}) => {
  const [showMoreReplies, setShowMoreReplies] = useState(false);

  const {
    data: commentReplyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetCommentReplyList({
    enable: item.repliesCount > 2,
    commentId: item.id,
    size: '5',
    sort: 'createdAt,desc',
  });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="flex flex-col gap-2">
      <CommentItem
        item={item}
        setSelectedComment={setSelectedComment}
        selectedComment={selectedComment}
        variant="post"
      />
      {item.repliesCount > 0 && (
        <div className="ml-10 flex flex-col gap-2">
          {item.replies.map((reply: ICommentItemResponse) => (
            <CommentItem
              key={reply.id}
              item={reply}
              setSelectedComment={setSelectedComment}
              selectedComment={selectedComment}
              variant="reply"
            />
          ))}
        </div>
      )}
      {item.repliesCount > 2 && !showMoreReplies && (
        <div className="ml-10 flex flex-col gap-2">
          <p
            className="font-s-2 cursor-pointer text-gray-08"
            onClick={() => setShowMoreReplies(true)}
          >
            댓글 더보기
          </p>
        </div>
      )}
      {showMoreReplies && (
        <div className="ml-10 flex flex-col gap-3">
          {commentReplyData?.content.map((replyItem) => (
            <CommentItem
              key={replyItem.id}
              item={replyItem}
              setSelectedComment={setSelectedComment}
              selectedComment={selectedComment}
              variant="reply"
            />
          ))}
          <div ref={observerRef}>{isFetchingNextPage && <Loading />}</div>
        </div>
      )}
    </div>
  );
};

export default CommentList;
