import { z } from 'zod';

export const inquirySchema = z.object({
  content: z.string(),
});

export type TInquirySchema = z.infer<typeof inquirySchema>;
