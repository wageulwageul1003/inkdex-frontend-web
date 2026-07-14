import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryKeys = createQueryKeyStore({
  emotion: {
    list: null,
  },
  post: {
    list: (params: { size?: string; page?: string }) =>
      ['mypage', 'follower-list', params] as const,
    detail: (uuid: string) => ['post', uuid] as const,
  },
  search: {
    recentSearchKeywordList: null,
    postList: (params: {
      size?: string;
      page?: string;
      searchKeyword?: string;
      feedType: string;
    }) => ['search', 'post-list', params] as const,
    userList: (params: {
      size?: string;
      page?: string;
      searchKeyword?: string;
    }) => ['search', 'post-list', params] as const,
  },
  mypage: {
    postList: (params: {
      size?: string;
      page?: string;
      year: string;
      month: string | null;
    }) => ['mypage', 'post-list', params] as const,
    profile: null,
    followerList: (params: { size?: string; page?: string }) =>
      ['mypage', 'follower-list', params] as const,
    followingList: (params: { size?: string; page?: string }) =>
      ['mypage', 'following-list', params] as const,
  },
  other: {
    profile: (uuid: string) => ['other', 'profile', uuid] as const,
  },
  notificationSetting: {},
  notification: {
    readStatus: null,
    list: (params: { size?: string; page?: string }) =>
      ['notification', 'list', params] as const,
  },
  collection: {
    list: (params?: { size?: string; page?: string; accountUuid?: string }) =>
      ['collection', 'list', params] as const,
    postList: (params: {
      size?: string;
      page?: string;
      collectionUuid?: string;
    }) => ['collection', 'post-list', params] as const,
    detail: (uuid: string) => ['collection', uuid] as const,
  },
  withdraw: {
    reasonList: null,
  },
  faq: {
    categoryList: null,
    list: (params: {
      size?: string;
      page?: string;
      faqCategoryUuid?: string;
    }) => ['faq', 'list', params] as const,
  },
  notice: {
    categoryList: null,
    list: (params: {
      size?: string;
      page?: string;
      noticeCategoryUuid?: string;
      searchKeyword?: string;
    }) => ['notice', 'list', params] as const,
  },
  term: {
    list: null,
    detail: (uuid: string) => ['term', uuid] as const,
  },
});
