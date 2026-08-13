import { z } from 'zod';

export const searchSchema = z.object({
  searchKeyword: z.string().min(1, { message: '검색어를 입력해 주세요.' }),
});

export type TSearchSchema = z.infer<typeof searchSchema>;
