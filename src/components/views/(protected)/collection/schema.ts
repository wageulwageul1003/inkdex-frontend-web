import { z } from 'zod';

export const CollectionWriteSchema = z.object({
  image: z.string().optional(),
  name: z.string(),
});

export type TCollectionWriteSchema = z.infer<typeof CollectionWriteSchema>;
