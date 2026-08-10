import { z } from 'zod';

export const inquirySchema = z.object({
  email: z.string(),
  content: z.string().min(1, { message: '내용을 입력해 주세요.' }),
  files: z.array(z.string()),
});

export type TInquirySchema = z.infer<typeof inquirySchema>;
