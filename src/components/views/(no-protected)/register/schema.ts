import { z } from 'zod';

export const registerStep1Schema = z.object({
  agreeAll: z.boolean().optional(),
});

export type TRegisterStep1Schema = z.infer<typeof registerStep1Schema>;

export const registerStep2Schema = z.object({
  email: z.string().min(1, { message: '이메일을 입력해 주세요.' }),
  code: z.string().nonempty({ message: '인증번호를 입력해 주세요.' }),
  nickname: z.string().min(1, { message: '닉네임을 입력해 주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해 주세요.' }),
  agreedTermIds: z.array(z.string()).optional(),
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
