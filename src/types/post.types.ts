export interface IPostListResponse {
  uuid: string;
  source: string;
  reflection: string;
  imageUrl: null | string;
  visibility: string;
  createdAt: string;
  emotion: {
    uuid: string;
    name: string;
  };
  collections: string[];
  tags: string[];
  likeCount: number;
  account: {
    uuid: string;
    nickname: string;
    profileImageUrl: null | string;
    bio: null | string;
    isFollowing: boolean;
  };
  isLiked: boolean;
}
