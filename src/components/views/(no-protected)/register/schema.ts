import { z } from 'zod';

import { validatePassword } from '@/lib/utils';

export const registerStep1Schema = z.object({
  allAgree: z.boolean().default(false),
  age: z.boolean(),
  terms: z.boolean(),
  privacy: z.boolean(),
  isPersonalTermAgree: z.boolean().default(false).optional(), // 선택
  marketing: z.boolean().default(false).optional(), // 선택
  isMarketingEmailAgree: z.boolean().default(false).optional(), // 선택
  isMarketingSmsAgree: z.boolean().default(false).optional(), // 선택
});

export type TRegisterStep1Schema = z.infer<typeof registerStep1Schema>;

// 휴대폰 인증번호 요청
export interface IRegisterCertification {
  phone: string;
}

// 휴대폰 인증번호 확인
export const registerStep2Schema = z.object({
  phone: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }),
  certificationNumber: z.string(),
});

export type TRegisterStep2Schema = z.infer<typeof registerStep2Schema>;

// 회원가입

export const registerStep3Schema = z.object({
  constMemberType: z
    .string()
    .nonempty({ message: '필수 항목을 입력해 주세요.' }), // 회원 구분
  account: z
    .string()
    .nonempty({ message: '필수 항목을 입력해 주세요.' })
    .min(6, { message: '6자 이상 입력하세요.' })
    .max(20, { message: '20자 이하 입력하세요.' })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: '영문, 숫자만 입력하세요.',
    }), // 아이디
  name: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }), // 이름
  nickName: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }), // 닉네임
  password: z
    .string()
    .min(8, { message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.' })
    .refine((pwd) => validatePassword(pwd), {
      message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.',
    })
    .optional(), // 비밀번호
  confirmedPassword: z
    .string()
    .min(8, { message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.' })
    .refine((pwd) => validatePassword(pwd), {
      message: '영문, 숫자, 특수문자 포함 8자 이상 입력하세요.',
    })
    .optional(), // 비밀번호 재확인

  phone: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }), // 휴대폰
  email: z.string().nonempty({ message: '필수 항목을 입력해 주세요.' }), // 이메일
  addressZipCode: z
    .string()
    .nonempty({ message: '필수 항목을 입력해 주시기 바랍니다.' }), // 우편번호
  addressDefault: z
    .string()
    .nonempty({ message: '필수 항목을 입력해 주시기 바랍니다.' }), // 기본 주소
  addressDetail: z.string().optional(), // 상세 주소
  constGender: z
    .string()
    .nonempty({ message: '필수 항목을 입력해 주시기 바랍니다.' }), // 성별
  birth: z.date({
    required_error: '필수 항목을 입력해 주세요.',
    invalid_type_error: '필수 항목을 입력해 주세요.',
  }), // 생년월일
  constJob: z
    .string()
    .nonempty({ message: '필수 항목을 입력해 주시기 바랍니다.' })
    .min(1, { message: '필수 항목을 입력해 주시기 바랍니다.' }), // 직업/역할
  isPersonalTermAgree: z.boolean(), // 개인 정보 수집 동의
  marketing: z.boolean(), // 마케팅 수신 동의
  isMarketingEmailAgree: z.boolean(), // 이메일 수신 동의
  isMarketingSmsAgree: z.boolean(), // SMS 수신 동의
  additionalInfo: z.object({
    // 추가 정보 입력
    constOrganizationType: z.string().nullable().optional(), // 기관 구분
    constAffiliationInputType: z.string().nullable().optional(), // 기관명 입력 방식
    affiliationName: z.string().nullable().optional(), // 기관명
    regionProvince: z.string().nullable().optional(), // 시/도
    regionDistrict: z.string().nullable().optional(), // 구/군
    constEstablishmentType: z.string().nullable().optional(), // 설립 구분
    additionalInfoExtendInfo: z
      .array(
        // 담당 업무
        z.object({
          constResponsibilityType: z.string().nullable().optional(), // 담당 업무
          responsibilityTypeManual: z.string().nullable().optional(), // 담당 업무 기타
        }),
      )
      .optional(),
    constRegistrationPurpose: z.string().nullable().optional(), // 가입 목적
    registrationPurposeManual: z.string().nullable().optional(), // 가입 목적 기타
    constRegistrationSource: z.string().nullable().optional(), // 가입 경로
    registrationSourceManual: z.string().nullable().optional(), // 가입 경로 기타
  }),
});

export type TRegisterStep3Schema = z.infer<typeof registerStep3Schema>;

// 기존 회원 정보
export interface ILegacyUserInfo {
  birth: string;
  isActive: true;
  isMarketingEmailAgree: false;
  isMarketingSmsAgree: false;
  isPersonalTermAgree: false;
  addressDefault: string;
  addressDetail: string;
  addressZipCode: string;
  constGender: string;
  constMemberType: string;
  email: string;
  name: string;
  nickName: string;
  phone: string;
  constMemberRole: string;
}
