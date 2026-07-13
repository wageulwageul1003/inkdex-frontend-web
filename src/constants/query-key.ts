import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryKeys = createQueryKeyStore({
  emotion: {
    list: null,
  },
  post: {
    detail: (uuid: string) => ['post', uuid] as const,
  },
  mypage: {
    postList: (params: {
      size?: string;
      page?: string;
      year: string;
      month: string | null;
    }) => ['mypage', 'postList', params] as const,
    profile: null,
  },
  other: {
    profile: (uuid: string) => ['other', 'profile', uuid] as const,
  },
  notificationSetting: {},
});
