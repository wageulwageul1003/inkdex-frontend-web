import { useGetHotSearchKeywords } from '@/hook/search/useGetHotSearchKeywords';

export const Hot = () => {
  const { data: hotItems } = useGetHotSearchKeywords();
  return (
    <div className="flex flex-col gap-4">
      <p>인기 검색어</p>
      <div className="grid grid-cols-2 gap-2"></div>
    </div>
  );
};
