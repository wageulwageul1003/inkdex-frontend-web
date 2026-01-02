'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep1Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { usePostConfirmEmail } from '@/hooks/auth/usePostConfirmEmail';
import { usePostVerifyEmail } from '@/hooks/auth/usePostVerifyEmail';
import { ErrorData } from '@/utils/fetch';

const Step1 = () => {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false); // 인증번호의 유효성
  const [buttonText, setButtonText] = useState('인증 요청');
  const [isCertNumVisible, setIsCertNumVisible] = useState(false); // 인증번호 입력 필드 표시 여부
  const [expireTimestamp, setExpireTimestamp] = useState<number | null>(null); // 타이머 만료 타임스탬프
  const { mutateAsync: postVerifyEmail } = usePostVerifyEmail(); // 인증번호 요청
  const { mutateAsync: postConfirmEmail } = usePostConfirmEmail(); // 인증번호 확인

  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(registerStep1Schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const { formState, setError, clearErrors } = form;

  useEffect(() => {
    if (!expireTimestamp || !isCertNumVisible || buttonText === '인증 완료')
      return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      if (now >= expireTimestamp) {
        clearInterval(interval);
        // 타이머가 만료되면 오류 메시지 표시
        setError('code', {
          type: 'manual',
          message: '인증번호가 만료됐어요. 재전송해주세요.',
        });
        setButtonText('인증 재요청');
        setIsValid(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTimestamp, isCertNumVisible, buttonText, setError]);

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

    clearErrors('code');

    try {
      const result = await postVerifyEmail({
        email: form.getValues('email'),
      });

      if (result) {
        // 5분
        const newExpireTimestamp = new Date().getTime() + 5 * 60 * 1000;
        setExpireTimestamp(newExpireTimestamp);
        toast.success('인증번호가 전송되었습니다.');

        setButtonText('인증번호 확인');
        setIsCertNumVisible(true);
      }
    } catch (error) {
      const errorData = error as ErrorData;
      console.log(errorData);
      if (errorData?.code === 'error.unprocessable_entity') {
        setError('email', {
          type: 'manual',
          message: '올바른 이메일 형식을 입력해주세요.',
        });
      } else if (errorData?.code === 'error.user.email_duplicate') {
        setError('email', {
          type: 'manual',
          message: '이미 사용 중인 이메일 주소입니다.',
        });
      }
    }
  };

  const handleVerifyCertNum = async () => {
    const now = Date.now();

    if (expireTimestamp && now > expireTimestamp) {
      setError('code', {
        type: 'manual',
        message: '인증번호가 만료됐어요. 재전송해주세요.',
      });
      return;
    }

    try {
      // 인증번호 확인 요청
      const result = await postConfirmEmail({
        email: form.getValues('email'),
        code: form.getValues('code'),
      });

      if (result?.data?.content) {
        setIsValid(true);
        clearErrors('code');
        setButtonText('인증 완료');
        router.push(`/register/step2?email=${form.getValues('email')}`);
      }
    } catch (error) {
      const errorData = error as ErrorData;
      if (errorData?.code === 'error.auth.code_expired_warn') {
        setError('code', {
          type: 'manual',
          message: '인증번호가 만료됐어요. 재전송해주세요.',
        });
      } else if (errorData?.code === 'error.auth.code_mismatch') {
        setError('code', {
          type: 'manual',
          message: '인증번호가 일치하지 않습니다.',
        });
      }
    }
  };

  const onSubmit = () => {
    handleVerifyCertNum();
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="flex py-3">
        <span onClick={() => router.back()}>
          <Icons.ArrowBackIos className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <p className="font-l-1 text-black">사용할 이메일을 입력해주세요.</p>
        <p className="font-xs-2 text-gray-06">
          실제 사용 중인 이메일 주소를 입력해주세요 <br />
          입력하신 이메일은 로그인 및 비밀번호 찾기에 사용됩니다.
        </p>
      </div>

      <div className="mt-[34px] flex flex-1 flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('Validation Errors:', errors);
            })}
            className=""
          >
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <FormFields
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  placeholder="이메일을 입력해주세요"
                  className="flex-1"
                />

                <Button
                  type="button"
                  onClick={
                    buttonText === '인증 요청' || buttonText === '인증 재요청'
                      ? startTimer
                      : undefined
                  }
                  disabled={buttonText === '인증 완료'}
                  size="lg"
                  variant="contained"
                  className="w-fit"
                >
                  {buttonText}
                </Button>
              </div>

              {isCertNumVisible && (
                <FormFields
                  fieldType={FormFieldType.TIMER_INPUT}
                  control={form.control}
                  name="code"
                  placeholder="인증번호를 입력해주세요"
                  isVerified={buttonText === '인증 완료'}
                  expire={expireTimestamp ?? 0}
                  disabled={buttonText === '인증 완료'}
                />
              )}
            </div>
          </form>
        </Form>
      </div>

      <div className="pb-[52px]">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default Step1;
