import { z } from 'zod';

export const registerFcmTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.string(),
  deviceId: z.string().optional(),
});

export type TRegisterFcmTokenSchema = z.infer<typeof registerFcmTokenSchema>;
