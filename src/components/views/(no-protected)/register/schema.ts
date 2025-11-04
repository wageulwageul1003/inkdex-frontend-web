import { z } from 'zod';

import { validatePassword } from '@/lib/utils';

export const registerStep1Schema = z.object({
  email: z.string().min(1, { message: '이메일을 입력해 주세요.' }),
  code: z.string().nonempty({ message: '인증번호를 입력해 주세요.' }),
});

export type TRegisterStep1Schema = z.infer<typeof registerStep1Schema>;

export const registerStep2Schema = z
  .object({
    password: z
      .string()
      .min(8, { message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.' })
      .refine((pwd) => validatePassword(pwd), {
        message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.',
      })
      .optional(), // 비밀번호
    passwordConfirm: z
      .string()
      .min(1, { message: '비밀번호를 한번 더 입력해주세요.' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type TRegisterStep2Schema = z.infer<typeof registerStep2Schema>;

export const verifyEmailSchema = z.object({
  email: z.string().min(1, { message: '이메일을 입력해 주세요.' }),
});

export type TVerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export const confirmEmailSchema = z.object({
  email: z.string().min(1, { message: '이메일을 입력해 주세요.' }),
  code: z.string().min(1, { message: '인증번호를 입력해 주세요.' }),
});

export type TConfirmEmailSchema = z.infer<typeof confirmEmailSchema>;
