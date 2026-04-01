import { useQuery } from '@tanstack/react-query';

import { termsDetailKey } from '@/constants/queryKeys';
import { IResponseDetail } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ITermsDetailResponse {
  title: string;
  content: string;
}

export const GetTermsDetail = async (
  uuid: string,
): Promise<IResponseDetail<ITermsDetailResponse>> => {
  const data = await agent(`/api/terms/${uuid}`, {
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
