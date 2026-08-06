import { VISIBILITY_ENUM } from '@/constants/enum';
import { z } from 'zod';

export const CollectionWriteSchema = z.object({
  uuid: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  name: z.string(),
  visibility: z.enum(VISIBILITY_ENUM),
});

export type TCollectionWriteSchema = z.infer<typeof CollectionWriteSchema>;
