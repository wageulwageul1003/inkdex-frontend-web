import { z } from 'zod';

import { validateEmail } from '@/lib/utils';

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해 주세요.' })
    .refine((email) => validateEmail(email), {
      message: '올바른 이메일 형식을 입력해주세요.',
    }),
});

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
