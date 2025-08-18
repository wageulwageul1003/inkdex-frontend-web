import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { z } from 'zod';

import { termsListKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ITermsListResponse {
  id: string;
  title: string;
  isRequired: boolean;
}

export const TermsListScheme = z.object({});

export const GetTermsList = async (): Promise<
  IResponse<ITermsListResponse>
> => {
  const queryParams = new URLSearchParams();

  const url = `/api/v1/terms/active`;

  const data = await agent(url, {
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
