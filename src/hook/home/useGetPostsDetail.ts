import { useQuery } from '@tanstack/react-query';

import { postsDetailKey } from '@/constants/queryKeys';
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

export const GetPostsDetail = async (
  uuid: string,
): Promise<IPostsDetailResponse> => {
  const data = await agent(`/api/v1/posts/${uuid}`, {
    method: 'GET',
  });

  return data.data.content;
};

export const useGetPostsDetail = (uuid: string) =>
  useQuery({
    queryKey: [postsDetailKey, uuid],
    queryFn: () => GetPostsDetail(uuid),
    enabled: !!uuid,
  });
