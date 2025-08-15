'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep2Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { usePostConfirmEmail } from '@/hook/auth/usePostConfirmEmail';
import { usePostVerifyEmail } from '@/hook/auth/usePostVerifyEmail';
import { ErrorData } from '@/utils/fetch';

const Step2 = () => {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false); // 인증번호의 유효성
  const [buttonText, setButtonText] = useState('인증번호 요청');
  const [isCertNumVisible, setIsCertNumVisible] = useState(false); // 인증번호 입력 필드 표시 여부
  const [expireTimestamp, setExpireTimestamp] = useState<number | null>(null); // 타이머 만료 타임스탬프
  const { mutateAsync: postVerifyEmail } = usePostVerifyEmail(); // 인증번호 요청
  const { mutateAsync: postConfirmEmail } = usePostConfirmEmail(); // 인증번호 확인
  const [account, setAccount] = useState('');

  const form = useForm({
    resolver: zodResolver(registerStep2Schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      certificationNumber: '',
    },
  });

  const { control, formState, handleSubmit, setError, clearErrors } = form;

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

  const onSubmit = () => {
    router.push(`/recovery/id/${account}`);
  };

  // 인증번호 요청 함수
  const startTimer = async () => {
    const emailValue = form.getValues('email').trim();

    if (!emailValue) {
      await form.trigger('email');
      setTimeout(() => {
        form.setError('email', {
          type: 'manual',
          message: '이메일을 입력해 주세요.',
        });
      }, 0);
      return;
    }

    clearErrors('certificationNumber');

    try {
      const result = await postVerifyEmail({
        email: form.getValues('email'),
      });

      if (result) {
        // 5분
        const newExpireTimestamp = new Date().getTime() + 5 * 60 * 1000;
        setExpireTimestamp(newExpireTimestamp);

        setButtonText('인증번호 확인');
        setIsCertNumVisible(true);
      }
    } catch (error) {
      const errorData = error as ErrorData;
      if (errorData?.code === 4001) {
        setError('email', {
          type: 'manual',
          message: '이메일을 입력해 주세요.',
        });
      } else {
        alert({
          title: '일치하는 계정을 찾을 수 없습니다.',
          description: (
            <div className="flex w-full flex-col">
              <span className="font-body1 text-center text-gray-500">
                입력하신 이름과 이메일이 일치하지 않습니다. 가입 시 입력한
                정보가 맞는지 다시 한번 확인해 주세요.
              </span>
            </div>
          ),
          cancelButton: null,
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
      const result = await postConfirmEmail({
        email: form.getValues('email'),
        code: form.getValues('certificationNumber'),
      });

      if (result?.data?.isVerified) {
        setIsValid(true);
        clearErrors('certificationNumber');
        setButtonText('인증 완료');
        setAccount(result.data.account);
      }
    } catch (error) {
      const errorData = error as ErrorData;
      // if (errorData?.code === 4001) {
      //   setError('certificationNumber', {
      //     type: 'manual',
      //     message: '입력 유효 시간이 초과되었습니다. 다시 요청해주세요.',
      //   });
      // } else if (errorData?.code === 4002) {
      //   setError('certificationNumber', {
      //     type: 'manual',
      //     message: '인증번호가 일치하지 않습니다.',
      //   });
      // } else if (errorData.code === 4003) {
      //   alert({
      //     title: '일치하는 계정을 찾을 수 없습니다.',
      //     description: (
      //       <div className="flex w-full flex-col">
      //         <span className="font-body1 text-center text-gray-500">
      //           입력하신 이름과 이메일이 일치하지 않습니다. 가입 시 입력한
      //           정보가 맞는지 다시 한번 확인해 주세요.
      //         </span>
      //       </div>
      //     ),
      //     cancelButton: null,
      //   });
      // } else {
      //   setError('certificationNumber', {
      //     type: 'manual',
      //     message: '인증번호 확인에 실패했습니다.',
      //   });
      // }
    }
  };

  return (
    <>
      <Header
        title="이메일 회원가입"
        left={
          <Icons.keyboardArrowLeft
            onClick={() => router.back()}
            className="size-6 fill-black"
          />
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Validation Errors:', errors);
          })}
          className="w-full"
        >
          <div className="mt-8 flex flex-col gap-5">
            <div className="flex gap-2">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="이메일"
                placeholder="이메일 입력"
              />

              <Button
                type="button"
                variant="cta"
                size="cta"
                onClick={
                  buttonText === '인증번호 요청' ||
                  buttonText === '인증번호 재전송'
                    ? startTimer
                    : handleVerifyCertNum
                }
                disabled={buttonText === '인증 완료'}
                className="mt-3 w-full"
              >
                {buttonText}
              </Button>
            </div>

            {buttonText === '인증 완료' && (
              <div className="flex items-center gap-2">
                <Icons.check className="size-4 fill-green-500" />
                <span>인증 완료되었습니다.</span>
              </div>
            )}

            {isCertNumVisible && (
              <FormFields
                fieldType={FormFieldType.TIMER_INPUT}
                control={form.control}
                name="code"
                label="인증번호"
                placeholder="인증번호 입력"
                isVerified={buttonText === '인증 완료'}
                expire={expireTimestamp ?? 0}
              />
            )}

            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="영문, 숫자, 특수문자 조합 8자 이상"
            />

            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="nickName"
              label="닉네임"
              placeholder="닉네임 입력"
              required
            />
          </div>
        </form>
      </Form>

      <Button
        onClick={form.handleSubmit(onSubmit)}
        className={`mt-[80px] w-full rounded px-4 py-2 ${
          formState.isValid && isValid
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 text-gray-400'
        }`}
        disabled={!formState.isValid}
      >
        가입하기
      </Button>
    </>
  );
};

export default Step2;
