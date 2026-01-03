import { useQuery } from '@tanstack/react-query';

import { myInkdexCalendarKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface IPostsDetailResponse {
  publicId: string;
  userPublicId: string;
  userNickname: string;
  profileImageUrl: string | null;
  categorySlug: string;
  content: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  bookmarked: number;
  createdAt: string;
  updatedAt: string;
}

type TGetMyInkdexCalendarParams = {
  year: number;
  month: number;
};

export const GetPostsDetail = async (
  params: TGetMyInkdexCalendarParams,
): Promise<IPostsDetailResponse> => {
  const data = await agent(
    `/api/v1/me/posts/calendar?year=${params.year}&month=${params.month}`,
    {
      method: 'GET',
    },
  );

  return data.data.content;
};

export const useGetMyInkdexCalendar = (params: TGetMyInkdexCalendarParams) =>
  useQuery({
    queryKey: [myInkdexCalendarKey, params],
    queryFn: () => GetPostsDetail(params),
    enabled: !!params.year && !!params.month,
  });
