import Chips from '@/components/shared/chips';
import { useGetRecommendSearchKeywords } from '@/hook/search/useGetRecommendSearchKeywords';

export const Recommends = () => {
  const { data: recommendItems } = useGetRecommendSearchKeywords();
  return (
    <div className="flex flex-col gap-4">
      <p>추천 검색어</p>
      <div>
        <Chips items={recommendItems} />
      </div>
    </div>
  );
};
