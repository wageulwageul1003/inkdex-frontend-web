import { z } from 'zod';

export const loginSchema = z.object({
  account: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
  saveAccount: z.string().or(z.null()).optional(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;

export interface ILogin {
  account: string;
  password: string;
}
