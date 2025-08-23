import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  /**
   * 다음 페이지를 가져오기 전에 관찰할 임계값 (0~1)
   * 0.1은 요소가 10% 보일 때 트리거
   */
  threshold?: number;
  /**
   * 로딩 상태일 때 다음 페이지 요청을 방지
   */
  enabled?: boolean;
}

/**
 * 무한 스크롤을 위한 커스텀 훅
 *
 * @param fetchNextPage 다음 페이지를 가져오는 함수
 * @param hasNextPage 다음 페이지가 있는지 여부
 * @param isFetchingNextPage 다음 페이지를 가져오는 중인지 여부
 * @param options 추가 옵션
 * @returns 관찰할 요소에 연결할 ref
 */
export function useInfiniteScroll<TData, TError>(
  {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }: Pick<
    UseInfiniteQueryResult<TData, TError>,
    'fetchNextPage' | 'hasNextPage' | 'isFetchingNextPage'
  >,
  options: UseInfiniteScrollOptions = {},
) {
  const { threshold = 0.1, enabled = true } = options;
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 요소가 화면에 보이고, 다음 페이지가 있으며, 현재 로딩 중이 아니고, 활성화되어 있을 때만 다음 페이지 로드
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          enabled
        ) {
          fetchNextPage();
        }
      },
      { threshold },
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, threshold, enabled]);

  return observerRef;
}
