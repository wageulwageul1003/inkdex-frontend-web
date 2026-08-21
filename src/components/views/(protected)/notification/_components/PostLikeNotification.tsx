import { Icons } from '@/components/shared/icons';
import { useGetPostDetail } from '@/hooks/posts/useGetPostDetail';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface IPostLikeNotification {
  uuid: string;
  nickname: string;
  profileImageUrl: string | null;
  targetUuid: string;
}

const PostLikeNotification = ({
  nickname,
  profileImageUrl,
  targetUuid,
}: IPostLikeNotification) => {
  const router = useRouter();
  const { data: postData } = useGetPostDetail(targetUuid);
  return (
    <div
      className="flex items-center gap-3 py-3"
      onClick={() => router.push(`/posts/${targetUuid}`)}
    >
      <div className="flex gap-3">
        <div className="p-1">
          <Icons.heart_filled className="size-5 fill-red-05" />
        </div>
        <div>
          <p className="font-m-2 text-black">
            <span className="font-m-1">{nickname}님</span>이 내 기록을 마음에
            담았어요.
          </p>
          <Image
            src={profileImageUrl ?? '/default-profile.png'}
            alt={nickname}
            width={100}
            height={100}
            className="mt-3 h-8 w-8 rounded-full pt-1"
          />
        </div>
      </div>
      <Image
        src={postData?.data.imageUrl ?? '/default-image.png'}
        alt={postData?.data.source ?? ''}
        width={100}
        height={100}
        className="h-12 w-12 rounded-md"
      />
    </div>
  );
};

export default PostLikeNotification;
