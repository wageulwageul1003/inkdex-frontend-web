import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { IResponseDetail } from '@/types/global';
import { useQuery } from '@tanstack/react-query';
import { IPostListResponse } from '@/types/post.types';

export interface IMyPostArchivePostsResponse {
  content: IPostListResponse[];
  totalElements: number;
}

type TGetMyPostArchivePostsParams = {
  year: number;
  month: number;
  day: number;
};

export const getPostArchivePostsList = async (
  params: TGetMyPostArchivePostsParams,
): Promise<IResponseDetail<IMyPostArchivePostsResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.year) queryParams.set('year', String(params.year));
  if (params.month) queryParams.set('month', String(params.month));
  if (params.day) queryParams.set('day', String(params.day));

  const url = `/api/posts/me/archive/posts?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetMyPostsArchivePostsList = (
  params: TGetMyPostArchivePostsParams,
) =>
  useQuery({
    queryKey: queryKeys.mypage.archivePostsList(params).queryKey,
    queryFn: () => getPostArchivePostsList(params),
  });
