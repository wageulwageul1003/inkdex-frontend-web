import { z } from 'zod';

export const CurrentPasswordSchema = z.object({
  currentPassword: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type TCurrentPasswordSchema = z.infer<typeof CurrentPasswordSchema>;
