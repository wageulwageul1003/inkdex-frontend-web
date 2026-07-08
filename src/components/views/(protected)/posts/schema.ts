import { z } from 'zod';

export const writeSchema = z.object({
  imageUrl: z.string().optional(),
  source: z.string().min(1, { message: '입력해 주세요.' }),
  reflection: z.string().min(1, { message: '입력해 주세요.' }),
  emotionUuid: z.string().min(1, { message: '입력해 주세요.' }),
  tags: z.array(z.string()),
  collectionUuid: z.array(z.string()),
  visibility: z.string().min(1, { message: '입력해 주세요.' }),
});

export type TWriteSchema = z.infer<typeof writeSchema>;
