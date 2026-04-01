import { z } from 'zod';

export const inquirySchema = z.object({
  email: z.string(),
  content: z.string(),
  files: z.array(z.string()),
});

export type TInquirySchema = z.infer<typeof inquirySchema>;
