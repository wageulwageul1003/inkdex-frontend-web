import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { myInkdexCalendarKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IMyInkdexCalendarResponse {
  counts: number; // 전체 데이터 개수
  thumbnails: {
    date: string;
    thumbnailUrl: string;
    count: number;
  }[];
}

type TGetMyInkdexCalendarParams = {
  year: number;
  month: number;
};

export const GetMyInkdexCalendar = async (
  params: TGetMyInkdexCalendarParams,
): Promise<IMyInkdexCalendarResponse> => {
  const data = await agent(
    `/api/v1/me/posts/calendar?year=${params.year}&month=${params.month}`,
    {
      method: 'GET',
    },
  );

  return data.data.content;
};

export const useGetMyInkdexCalendar = (
  params: TGetMyInkdexCalendarParams,
): UseQueryResult<IMyInkdexCalendarResponse> =>
  useQuery({
    queryKey: [myInkdexCalendarKey, params],
    queryFn: () => GetMyInkdexCalendar(params),
    enabled: !!params.year && !!params.month,
  });
