import { useQuery } from '@tanstack/react-query';

import { IResponseDetail } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';

export interface INoticeDetailResponse {
  uuid: string;
  title: string;
  content: string;
  viewCount: number;
  isPinned: boolean;
  createdAt: string;
  category: {
    uuid: string;
    name: string;
  };
}

export const getNoticeDetail = async (
  noticeUuid: string,
): Promise<IResponseDetail<INoticeDetailResponse>> => {
  const data = await agent(`/api/notices/${noticeUuid}`, {
    method: 'GET',
  });

  return data;
};

export const useGetNoticeDetail = (noticeUuid: string) =>
  useQuery({
    queryKey: queryKeys.notice.detail(noticeUuid).queryKey,
    queryFn: () => getNoticeDetail(noticeUuid),
    enabled: !!noticeUuid,
  });
