import { useQuery } from '@tanstack/react-query';

import { termsDetailKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ITermsDetailResponse {
  id: string;
  content: string;
}

export const GetTermsDetail = async (
  uuid: string,
): Promise<IResponse<ITermsDetailResponse>> => {
  const data = await agent(`/api/v1/terms/active/${uuid}`, {
    method: 'GET',
  });

  return data;
};

export const useGetTermsDetail = (uuid: string) =>
  useQuery({
    queryKey: [termsDetailKey, uuid],
    queryFn: () => GetTermsDetail(uuid),
    enabled: !!uuid,
  });
