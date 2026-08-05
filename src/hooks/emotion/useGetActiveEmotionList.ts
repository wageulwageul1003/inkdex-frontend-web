import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { IEmotionListResponse } from './useGetEmotionList';

export const getActiveEmotionList = async (): Promise<
  IResponse<IEmotionListResponse>
> => {
  const data = await agent(`/api/emotion/active`, {
    method: 'GET',
  });

  return data;
};

export const useGetActiveEmotionList = (): UseQueryResult<
  IResponse<IEmotionListResponse>
> =>
  useQuery({
    queryKey: queryKeys.emotion.active.queryKey,
    queryFn: () => getActiveEmotionList(),
  });
