import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { IResponse } from '@/types/global';
import { useQuery } from '@tanstack/react-query';

export interface IMyPostArchiveResponse {
  day: number;
  count: number;
  thumbnail: {
    uuid: string;
    imageUrl: string | null;
  };
}

type TGetMyPostArchiveParams = {
  year: string;
  month: string | null;
};

export const getPostArchiveList = async (
  params: TGetMyPostArchiveParams,
): Promise<IResponse<IMyPostArchiveResponse>> => {
  const queryParams = new URLSearchParams();

  if (params.year) queryParams.set('year', params.year);
  if (params.month) queryParams.set('month', params.month);

  const url = `/api/posts/me/archive?${queryParams.toString()}`;

  const data = await agent(url, {
    method: 'GET',
  });

  return data;
};

export const useGetMyPostArchiveList = (params: TGetMyPostArchiveParams) =>
  useQuery({
    queryKey: queryKeys.notice.categoryList.queryKey,
    queryFn: () => getPostArchiveList(params),
  });
