import { z } from 'zod';

export const EditProfileSchema = z.object({
  image: z.string().optional(),
  nickname: z.string().min(1, '닉네임을 입력해주세요'),
  bio: z.string().optional(),
});

export type TEditProfileSchema = z.infer<typeof EditProfileSchema>;
