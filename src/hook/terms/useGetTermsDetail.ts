import { useQuery } from '@tanstack/react-query';

import { termsDetailKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface ITermsDetailResponse {
  id: string;
  content: string;
}

export const GetTermsDetail = async (
  uuid: string,
): Promise<ITermsDetailResponse> => {
  const data = await agent(`/api/v1/terms/${uuid}`, {
    method: 'GET',
  });

  return data.data.content;
};

export const useGetTermsDetail = (uuid: string) =>
  useQuery({
    queryKey: [termsDetailKey, uuid],
    queryFn: () => GetTermsDetail(uuid),
    enabled: !!uuid,
  });
