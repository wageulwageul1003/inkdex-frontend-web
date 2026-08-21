import { Icons } from '@/components/shared/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface IFollowerNotification {
  uuid: string;
  nickname: string;
  profileImageUrl: string | null;
}

const FollowerNotification = ({
  uuid,
  nickname,
  profileImageUrl,
}: IFollowerNotification) => {
  const router = useRouter();
  return (
    <div className="flex gap-3 py-3" onClick={() => router.push(`/my/${uuid}`)}>
      <div className="p-1">
        <Icons.user className="size-5 fill-sand-05" />
      </div>
      <div>
        <p className="font-m-2 text-black">
          <span className="font-m-1">{nickname}님</span>이 나를 팔로우하기
          시작했습니다.
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
  );
};

export default FollowerNotification;
