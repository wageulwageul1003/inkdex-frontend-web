import { z } from 'zod';

export const writeSchema = z.object({
  image: z.string().optional(),
  categorySlug: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
});

export type TWriteSchema = z.infer<typeof writeSchema>;
