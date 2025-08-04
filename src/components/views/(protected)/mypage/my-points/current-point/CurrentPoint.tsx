import Seed from '@/components/shared/Seed';

interface CurrentPointProps {
  nickname: string;
  count: number;
}

export const CurrentPoint = ({ nickname, count }: CurrentPointProps) => {
  return (
    <div className="border=gray-200 flex w-full flex-col gap-1 rounded border px-6 py-4 shadow-2">
      <div className="font-body1 text-gray-500">{nickname}님의 보유 씨앗</div>
      <div className="flex items-center gap-1">
        <Seed />
        <span className="font-subtitle-bold text-gray-700">
          {count.toLocaleString()}
        </span>
        <span className="font-body2-bold text-gray-500">개</span>
      </div>
    </div>
  );
};
