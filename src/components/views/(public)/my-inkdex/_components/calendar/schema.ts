import { z } from 'zod';

export const selectCalendarSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

export type TSelectCalendarSchema = z.infer<typeof selectCalendarSchema>;
