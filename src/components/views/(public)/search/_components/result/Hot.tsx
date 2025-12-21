import { useRouter } from 'next/navigation';
import React from 'react';

import Chips from '@/components/shared/chips';
import { useGetCategoryList } from '@/hook/common/useGetCategoryList';
import { useInfiniteScroll } from '@/hook/common/useInfiniteScroll';
import { useGetPostsList } from '@/hook/home/useGetPostsList';

export const Hot = () => {
  const router = useRouter();
  const { data: categories } = useGetCategoryList();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList({
      category: '',
      size: '10',
      sort: 'createdAt,desc',
    });

  const observerRef = useInfiniteScroll(
    { fetchNextPage, hasNextPage, isFetchingNextPage },
    { threshold: 0.1 },
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-scroll px-4 py-2">
        <Chips
          items={[
            { value: '', label: '전체' },
            ...(categories?.data?.content.map((item) => ({
              value: item.slug,
              label: item.name,
            })) || []),
          ]}
          variant="single"
          type="text"
        />
      </div>
      {/* <div className="mt-4 flex flex-col gap-4">
        {data?.pages?.map(
          (page: IResponsePaged<IPostListResponse>, i: number) => (
            <React.Fragment key={i}>
              {page.data.content.map((item: IPostListResponse) => (
                <Card key={item.publicId} item={item} />
              ))}
            </React.Fragment>
          ),
        )}
        <div ref={observerRef}>{isFetchingNextPage && <Loading />}</div>
      </div> */}
    </div>
  );
};
