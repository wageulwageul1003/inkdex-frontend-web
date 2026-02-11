import { z } from 'zod';

export const inquirySchema = z.object({
  email: z.string(),
  content: z.string(),
});

export type TInquirySchema = z.infer<typeof inquirySchema>;
