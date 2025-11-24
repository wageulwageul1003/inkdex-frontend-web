import { useGetRecentSearchKeywords } from '@/hook/search/useGetRecentSearchKeywords';

export const Recents = () => {
  const { data: recentItems } = useGetRecentSearchKeywords();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p>최근 검색어</p>
        <p>전체 삭제</p>
      </div>
      <div className="flex gap-2"></div>
    </div>
  );
};
