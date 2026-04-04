import { z } from 'zod';

export const CollectionWriteSchema = z.object({
  uuid: z.string().optional(),
  imageUrl: z.string().optional(),
  name: z.string(),
});

export type TCollectionWriteSchema = z.infer<typeof CollectionWriteSchema>;
