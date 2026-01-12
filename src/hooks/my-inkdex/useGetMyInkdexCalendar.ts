import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { myInkdexCalendarKey } from '@/constants/queryKeys';
import { IResponse } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface IMyInkdexCalendarResponse {
  date: string;
  thumbnailUrl: string;
}

type TGetMyInkdexCalendarParams = {
  year: number;
  month: number;
};

export const GetMyInkdexCalendar = async (
  params: TGetMyInkdexCalendarParams,
): Promise<IResponse<IMyInkdexCalendarResponse>> => {
  const data = await agent(
    `/api/v1/me/posts/calendar?year=${params.year}&month=${params.month}`,
    {
      method: 'GET',
    },
  );

  return data;
};

export const useGetMyInkdexCalendar = (
  params: TGetMyInkdexCalendarParams,
): UseQueryResult<IResponse<IMyInkdexCalendarResponse>> =>
  useQuery({
    queryKey: [myInkdexCalendarKey, params],
    queryFn: () => GetMyInkdexCalendar(params),
    enabled: !!params.year && !!params.month,
  });
