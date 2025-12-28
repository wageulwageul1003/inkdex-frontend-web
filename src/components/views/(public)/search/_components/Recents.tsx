'use client';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { useDeleteSearchKeyword } from '@/hook/search/useDeleteSearchKeyword';
import { useGetRecentSearchKeywords } from '@/hook/search/useGetRecentSearchKeywords';

export const Recents = () => {
  const { data: recentItems } = useGetRecentSearchKeywords();
  const { mutateAsync: deleteSearchKeyword } = useDeleteSearchKeyword();

  return (
    <div className="flex flex-col gap-4">
      {recentItems && recentItems.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="font-m-1 text-black">최근 검색어</p>
            <Button
              variant="buttonText"
              size="buttonText"
              className="font-xs-2 text-gray-08"
            >
              전체 삭제
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {recentItems.map((item) => (
              <div key={item.id} className="flex items-center py-2">
                <p className="font-m-2 flex-1 text-gray-08">
                  {item.searchTerm}
                </p>
                <Icons.closeSmall
                  className="size-6 fill-gray-05"
                  onClick={() => deleteSearchKeyword({ searchId: item.id })}
                />
              </div>
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
