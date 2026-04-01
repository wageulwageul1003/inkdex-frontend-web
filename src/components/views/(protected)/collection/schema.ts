import { z } from 'zod';

export const CollectionWriteSchema = z.object({
  imageUrl: z.string().optional(),
  name: z.string(),
});

export type TCollectionWriteSchema = z.infer<typeof CollectionWriteSchema>;
