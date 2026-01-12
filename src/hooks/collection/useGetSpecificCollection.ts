import { useQuery } from '@tanstack/react-query';

import { specificCollectionKey } from '@/constants/queryKeys';
import { agent } from '@/utils/fetch';

export interface ISpecificCollectionResponse {
  collectionId: string;
  name: string;
  postCount: number;
  imageUrl: string;
  thumbnailUrl: string;
  createdBy: string;
  createdAt: string;
}

export const GetSpecificCollection = async (
  collectionId: string,
): Promise<ISpecificCollectionResponse> => {
  const data = await agent(`/api/v1/collections/${collectionId}`, {
    method: 'GET',
  });

  return data.data.content;
};

export const useGetSpecificCollection = ({
  collectionId,
}: {
  collectionId: string;
}) =>
  useQuery({
    queryKey: [specificCollectionKey, collectionId],
    queryFn: () => GetSpecificCollection(collectionId),
    enabled: !!collectionId,
  });
