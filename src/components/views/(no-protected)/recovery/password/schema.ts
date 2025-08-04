import { z } from 'zod';

// 휴대폰 인증 폼 검증 스키마
export const phoneNumberFormSchema = z.object({
  account: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  phone: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  certificationNumber: z.string(),
});

// 이메일 인증 폼 검증 스키마
export const emailFormSchema = z.object({
  account: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  email: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  certificationNumber: z.string(),
});

export type TPhoneNumberFormSchema = z.infer<typeof phoneNumberFormSchema>;
export type TEmailFormSchema = z.infer<typeof emailFormSchema>;

export type IPhoneNumberFormSchema = z.infer<typeof phoneNumberFormSchema>;
export type IEmailFormSchema = z.infer<typeof emailFormSchema>;

// 휴대폰 인증
export const findPasswordCertificationPhoneSchema = z.object({
  account: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  phone: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
});

// 이메일 인증
export const findPasswordCertificationEmailSchema = z.object({
  account: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  email: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
});

export type TFindPasswordCertificationPhoneSchema = z.infer<
  typeof findPasswordCertificationPhoneSchema
>;
export type TFindPasswordCertificationEmailSchema = z.infer<
  typeof findPasswordCertificationEmailSchema
>;

// 폼 검증 스키마
export const passwordResetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.',
      })
      .nonempty({ message: '필수 항목을 입력해 주세요.' }),
    newPasswordConfirm: z
      .string()
      .min(8, { message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.',
      })
      .nonempty({ message: '필수 항목을 입력해 주세요.' }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['newPasswordConfirm'],
  });

export type TPasswordResetSchema = z.infer<typeof passwordResetSchema>;
