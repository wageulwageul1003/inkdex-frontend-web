import { z } from 'zod';

export const writeSchema = z.object({
  imageUrl: z.string().optional(),
  categoryUuid: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  collectionUuid: z.array(z.string()),
});

export type TWriteSchema = z.infer<typeof writeSchema>;
