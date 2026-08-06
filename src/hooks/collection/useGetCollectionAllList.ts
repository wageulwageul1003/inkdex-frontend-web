import { useQuery } from '@tanstack/react-query';

import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { VisibilityType } from '@/constants/enum';

export interface ICollectionResponse {
  uuid: string;
  name: string;
  imageUrl: string;
  priority: number;
  visibility: VisibilityType;
  createdAt: string;
  postsCount: number;
}

export const getCollectionAllList = async (): Promise<
  IResponse<ICollectionResponse>
> => {
  const data = await agent(`/api/collections/all`, {
    method: 'GET',
  });

  return data;
};

export const useGetCollectionAllList = () =>
  useQuery({
    queryKey: queryKeys.notice.categoryList.queryKey,
    queryFn: () => getCollectionAllList(),
  });
