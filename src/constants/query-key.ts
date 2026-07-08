import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryKeys = createQueryKeyStore({
  emotion: {
    list: null,
  },
  mypage: {
    postList: (params: {
      size?: string;
      page?: string;
      year: string;
      month: string | null;
    }) => [params],
  },
});
