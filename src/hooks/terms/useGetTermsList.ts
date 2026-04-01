import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { z } from 'zod';

import { termsListKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ITermsListResponse {
  uuid: string;
  title: string;
  content: string;
  isRequired: boolean;
  createdAt: string;
}

export const TermsListScheme = z.object({});

export const GetTermsList = async (): Promise<
  IResponse<ITermsListResponse>
> => {
  const data = await agent(`/api/terms`, {
    method: 'GET',
  });

  return data;
};

export const useGetTermsList = (): UseQueryResult<
  IResponse<ITermsListResponse>
> =>
  useQuery({
    queryKey: [termsListKey],
    queryFn: () => GetTermsList(),
  });
