import { z } from 'zod';

export const CollectionReorderSchema = z.object({
  collectionUuids: z.array(z.string()),
});

export type TCollectionReorderSchema = z.infer<typeof CollectionReorderSchema>;
