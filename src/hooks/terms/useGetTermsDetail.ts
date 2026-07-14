import { useQuery } from '@tanstack/react-query';

import { IResponseDetail } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

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
    queryKey: queryKeys.term.detail(uuid).queryKey,
    queryFn: () => GetTermsDetail(uuid),
    enabled: !!uuid,
  });
