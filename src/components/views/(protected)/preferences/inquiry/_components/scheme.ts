import { z } from 'zod';

export const inquirySchema = z.object({
  searchKeyword: z.string(),
});

export type TInquirySchema = z.infer<typeof inquirySchema>;
