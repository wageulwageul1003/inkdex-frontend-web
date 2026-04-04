import { useQuery } from '@tanstack/react-query';

import { specificCollectionKey } from '@/constants/queryKeys';
import { IResponseDetail } from '@/types/global';
import { agent } from '@/utils/fetch';

export interface ISpecificCollectionResponse {
  uuid: string;
  name: string;
  imageUrl: string | null;
  priority: number;
  createdAt: string;
  postsCount: number;
}

export const GetSpecificCollection = async (
  collectionUuid: string,
): Promise<IResponseDetail<ISpecificCollectionResponse>> => {
  const data = await agent(`/api/collections/${collectionUuid}`, {
    method: 'GET',
  });

  return data;
};

export const useGetSpecificCollection = ({
  collectionUuid,
}: {
  collectionUuid: string;
}) =>
  useQuery({
    queryKey: [specificCollectionKey, collectionUuid],
    queryFn: () => GetSpecificCollection(collectionUuid),
    enabled: !!collectionUuid,
  });
