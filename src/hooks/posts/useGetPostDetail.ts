import { useQuery } from '@tanstack/react-query';

import { IResponseDetail } from '@/types/global';
import { agent } from '@/utils/fetch';
import { queryKeys } from '@/constants/query-key';
import { VisibilityType } from '@/constants/enum';

export interface ISpecificCollectionResponse {
  uuid: string;
  source: string;
  reflection: string;
  imageUrl: null | string;
  visibility: VisibilityType;
  createdAt: string;
  updatedAt: string;
  emotionUuid: string;
  collections: [
    {
      uuid: string;
      name: string;
      imageUrl: null | string;
    },
  ];
  tags: string[];
}

export const GetPostDetail = async (
  postUuid: string,
): Promise<IResponseDetail<ISpecificCollectionResponse>> => {
  const data = await agent(`/api/posts/${postUuid}`, {
    method: 'GET',
  });

  return data;
};

export const useGetPostDetail = (postUuid: string) =>
  useQuery({
    queryKey: queryKeys.post.detail(postUuid).queryKey,
    queryFn: () => GetPostDetail(postUuid),
    enabled: !!postUuid,
  });
