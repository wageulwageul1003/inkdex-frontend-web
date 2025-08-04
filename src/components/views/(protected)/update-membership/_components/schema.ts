import { z } from 'zod';

const schema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  id: z.string().min(1, 'ID is required'),

  zipCode: z.string().min(1, 'Zip code is required'),
  roadAddress: z.string().min(1, 'Road address is required'),
  joinPath: z.string().min(1, 'Join path is required'),
});

export type TUpdateMembership = z.infer<typeof schema>;

export default schema;

export const changePhoneSchema = z.object({
  newPhone: z.string().min(1, '휴대전화 번호를 입력해 주세요.'),
});

export type TChangePhone = z.infer<typeof changePhoneSchema>;

export const updatePwdSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: ' 필수 항목을 입력해 주세요.' }),
    newPassword: z.string().min(1, { message: ' 필수 항목을 입력해 주세요.' }),
    newPasswordConfirm: z
      .string()
      .min(1, { message: ' 필수 항목을 입력해 주세요.' }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['newPasswordConfirm'],
  });

export type TUpdatePwd = z.infer<typeof updatePwdSchema>;
