import { z } from 'zod';

export const searchSchema = z.object({
  searchKeyword: z.string(),
});

export type TSearchSchema = z.infer<typeof searchSchema>;
