'use client';

import { useGetRecentSearchKeywords } from '@/hook/search/useGetRecentSearchKeywords';

export const Recents = () => {
  const { data: recentItems } = useGetRecentSearchKeywords();
  console.log(recentItems);
  return (
    <div className="flex flex-col gap-4">
      {recentItems && recentItems.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p>최근 검색어</p>
            <p>전체 삭제</p>
          </div>
          <div className="flex gap-2">
            {recentItems.map((item) => (
              <p key={item.id}>{item.searchTerm}</p>
            ))}
          </div>
        </>
      ) : (
        <p className="font-s-2 mt-4 text-center text-gray-05">
          게시물 내용, 태그 또는 사용자 닉네임을 <br />
          검색해보세요.
        </p>
      )}
    </div>
  );
};
