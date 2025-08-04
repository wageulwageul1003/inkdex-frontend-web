'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  ILegacyUserInfo,
  registerStep2Schema,
  TRegisterStep2Schema,
} from '../schema';

import CButton from '@/components/shared/CButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { usePostRegisterCertification } from '@/hooks/auth/usePostRegisterCertification';
import { usePutRegisterCertificationCheck } from '@/hooks/auth/usePutRegisterCertificationCheck';
import { encryptObject } from '@/lib/utils';
import { ErrorData } from '@/utils/fetch';

const RegisterStep2View = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isValid, setIsValid] = useState(false); // 인증번호의 유효성
  const [buttonText, setButtonText] = useState('인증번호 요청');
  const [isCertNumVisible, setIsCertNumVisible] = useState(false); // 인증번호 입력 필드 표시 여부
  const [expireTimestamp, setExpireTimestamp] = useState<number | null>(null); // 타이머 만료 타임스탬프
  const { mutateAsync: postRegisterCertification } =
    usePostRegisterCertification(); // 인증번호 요청
  const { mutateAsync: putRegisterCertificationCheck } =
    usePutRegisterCertificationCheck(); // 인증번호 확인

  const [isExistingMember, setIsExistingMember] = useState(false); // 기존 회원 여부 check
  const [legacyUserInfo, setLegacyUserInfo] = useState<ILegacyUserInfo | null>(
    null,
  ); // 기존 회원 정보

  const form = useForm({
    resolver: zodResolver(registerStep2Schema),
    mode: 'onChange',
    defaultValues: {
      phone: '',
      certificationNumber: '',
    },
  });

  const { control, formState, handleSubmit, setError, clearErrors } = form;

  // Check for required query parameters from step1
  useEffect(() => {
    const isPersonalTermAgree = searchParams.get('isPersonalTermAgree');
    const isMarketingEmailAgree = searchParams.get('isMarketingEmailAgree');
    const isMarketingSmsAgree = searchParams.get('isMarketingSmsAgree');

    // If any of the required parameters are missing, redirect to step1
    if (
      isPersonalTermAgree === null ||
      isMarketingEmailAgree === null ||
      isMarketingSmsAgree === null
    ) {
      router.push('/register/step1');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!expireTimestamp || !isCertNumVisible || buttonText === '인증 완료')
      return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      if (now >= expireTimestamp) {
        clearInterval(interval);
        // 타이머가 만료되면 오류 메시지 표시
        setError('certificationNumber', {
          type: 'manual',
          message: '입력 유효 시간이 초과되었습니다. 다시 요청해주세요.',
        });
        setButtonText('인증번호 재전송');
        setIsValid(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTimestamp, isCertNumVisible, buttonText, setError]);

  const onSubmit = (values: TRegisterStep2Schema) => {
    // Get the query parameters from step1 to pass them to step3
    const isPersonalTermAgree = searchParams.get('isPersonalTermAgree');
    const isMarketingEmailAgree = searchParams.get('isMarketingEmailAgree');
    const isMarketingSmsAgree = searchParams.get('isMarketingSmsAgree');

    // Pass the form data and the query parameters from step1 to step3

    if (isExistingMember) {
      router.push(
        `/register/step3?isPersonalTermAgree=${isPersonalTermAgree}&isMarketingEmailAgree=${isMarketingEmailAgree}&isMarketingSmsAgree=${isMarketingSmsAgree}&phone=${values.phone}&isExistingMember=${isExistingMember}&legacyUserInfo=${encryptObject(
          legacyUserInfo,
        )}`,
      );
    } else {
      router.push(
        `/register/step3?isPersonalTermAgree=${isPersonalTermAgree}&isMarketingEmailAgree=${isMarketingEmailAgree}&isMarketingSmsAgree=${isMarketingSmsAgree}&phone=${values.phone}`,
      );
    }
  };

  // 인증번호 요청 함수
  const startTimer = async () => {
    const phoneValue = form.getValues('phone').trim();

    if (!phoneValue) {
      await form.trigger('phone');
      setTimeout(() => {
        form.setError('phone', {
          type: 'manual',
          message: '휴대전화 번호를 입력해 주세요.',
        });
      }, 0);
      return;
    }

    clearErrors('certificationNumber');

    // 5분
    const newExpireTimestamp = new Date().getTime() + 5 * 60 * 1000;
    setExpireTimestamp(newExpireTimestamp);

    try {
      const result = await postRegisterCertification({
        phone: form.getValues('phone'),
      });

      if (result.code === 2000) {
        toast.success('인증번호가 휴대번호로 전송되었습니다.');
        setButtonText('인증번호 확인');
        setIsCertNumVisible(true);
      }
    } catch (error) {
      console.log(error);
      const errorData = error as ErrorData;
      if (errorData.code === 4004) {
        setError('phone', {
          type: 'manual',
          message: '이미 가입된 번호입니다.',
        });
      }
    }
  };

  const handleVerifyCertNum = async () => {
    const now = Date.now();

    if (expireTimestamp && now > expireTimestamp) {
      setError('certificationNumber', {
        type: 'manual',
        message: '입력 유효 시간이 초과되었습니다. 다시 요청해주세요.',
      });
      return;
    }

    try {
      // 인증번호 확인 요청
      const result = await putRegisterCertificationCheck({
        phone: form.getValues('phone'),
        certificationNumber: form.getValues('certificationNumber'),
      });

      if (result?.data?.isVerified) {
        setIsValid(true);
        clearErrors('certificationNumber');
        setButtonText('인증 완료');
        setIsExistingMember(result?.data?.isExistingMember);
        setLegacyUserInfo(result?.data?.legacyUserInfo);
      }
    } catch (error) {
      const errorData = error as ErrorData;
      if (errorData?.code === 4001) {
        setError('certificationNumber', {
          type: 'manual',
          message: '입력 유효 시간이 초과되었습니다. 다시 요청해주세요.',
        });
      } else if (errorData?.code === 4002) {
        setError('certificationNumber', {
          type: 'manual',
          message: '인증번호가 일치하지 않습니다.',
        });
      } else if (errorData.code === 4004) {
        setError('certificationNumber', {
          type: 'manual',
          message: '이미 가입된 번호입니다.',
        });
      } else {
        setError('certificationNumber', {
          type: 'manual',
          message: '인증번호 확인에 실패했습니다.',
        });
      }
    }
  };

  return (
    <div className="default-login-layout-content">
      <div className="flex flex-col items-start text-left">
        <p className="font-subtitle-bold">본인 확인을 위해</p>
        <p className="font-subtitle-bold">휴대번호 인증이 필요해요.</p>
      </div>
      <p className="font-caption mt-2 flex flex-col items-start text-gray-400">
        인증 완료 후 회원가입을 계속해서 진행할 수 있습니다.
      </p>

      <div className="mt-8 flex flex-col items-start">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col gap-5">
              <FormFields
                control={control}
                name="phone"
                fieldType={FormFieldType.TIMER_INPUT}
                label="휴대번호"
                placeholder="'-'를 제외하고 입력"
              />

              {isCertNumVisible && (
                <FormFields
                  fieldType={FormFieldType.TIMER_INPUT}
                  control={form.control}
                  name="certificationNumber"
                  label="인증번호"
                  placeholder="인증번호 입력"
                  isVerified={buttonText === '인증 완료'}
                  expire={expireTimestamp ?? 0}
                />
              )}
            </div>

            <div className="mt-3 w-full">
              <CButton
                type="button"
                buttonType="contained"
                text={buttonText}
                onClick={
                  buttonText === '인증번호 요청' ||
                  buttonText === '인증번호 재전송'
                    ? startTimer
                    : handleVerifyCertNum
                }
                disabled={buttonText === '인증 완료'}
                className="w-full"
              />
            </div>

            <CButton
              buttonType="contained"
              text="다음"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className={`mt-[80px] w-full rounded px-4 py-2 ${
                formState.isValid && isValid
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
              disabled={!(formState.isValid && isValid)}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterStep2View;
