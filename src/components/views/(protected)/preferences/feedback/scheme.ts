import { z } from 'zod';

export const feedbackSchema = z.object({
  content: z.string(),
});

export type TFeedbackSchema = z.infer<typeof feedbackSchema>;
