import { z } from 'zod';

export const CurrentPasswordSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type TCurrentPasswordSchema = z.infer<typeof CurrentPasswordSchema>;

export const SetPasswordSchema = z.object({
  currentPassword: z.string().min(1, '비밀번호를 입력해주세요'),
  newPassword: z.string().min(1, '비밀번호를 입력해주세요'),
  confirmPassword: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type TSetPasswordSchema = z.infer<typeof SetPasswordSchema>;

export const DeleteAccountSchema = z.object({
  reasonUuid: z.string().min(1, '탈퇴 사유를 입력해주세요'),
});

export type TDeleteAccountSchema = z.infer<typeof DeleteAccountSchema>;
