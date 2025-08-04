import { z } from 'zod';

// 휴대폰 인증 폼 검증 스키마
export const phoneNumberFormSchema = z.object({
  name: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  phone: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  certificationNumber: z.string(),
});

// 이메일 인증 폼 검증 스키마
export const emailFormSchema = z.object({
  name: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  email: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  certificationNumber: z.string(),
});

export type TPhoneNumberFormSchema = z.infer<typeof phoneNumberFormSchema>;
export type TEmailFormSchema = z.infer<typeof emailFormSchema>;

export type IPhoneNumberFormSchema = z.infer<typeof phoneNumberFormSchema>;
export type IEmailFormSchema = z.infer<typeof emailFormSchema>;

// 휴대폰 인증
export const findIdCertificationPhoneSchema = z.object({
  name: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  phone: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
});

// 이메일 인증
export const findIdCertificationEmailSchema = z.object({
  name: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  email: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
});

export type TFindIdCertificationPhoneSchema = z.infer<
  typeof findIdCertificationPhoneSchema
>;
export type TFindIdCertificationEmailSchema = z.infer<
  typeof findIdCertificationEmailSchema
>;
