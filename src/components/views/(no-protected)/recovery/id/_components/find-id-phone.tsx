'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { phoneNumberFormSchema } from '../schema';

import CButton from '@/components/shared/CButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { usePostFindIdPhoneCertification } from '@/hooks/auth/find/id/usePostFindIdPhoneCertification';
import { usePutFindIdPhoneCertificationCheck } from '@/hooks/auth/find/id/usePutFindIdPhoneCertificationCheck';
import { useAlert } from '@/hooks/useAlert';
import { ErrorData } from '@/utils/fetch';

const FindIdPhone = () => {
  const router = useRouter();
  const alert = useAlert();
  const [isValid, setIsValid] = useState(false); // 인증번호의 유효성
  const [buttonText, setButtonText] = useState('인증번호 요청');
  const [isCertNumVisible, setIsCertNumVisible] = useState(false); // 인증번호 입력 필드 표시 여부
  const [expireTimestamp, setExpireTimestamp] = useState<number | null>(null); // 타이머 만료 타임스탬프
  const { mutateAsync: postFindIdCertification } =
    usePostFindIdPhoneCertification(); // 인증번호 요청
  const { mutateAsync: putFindIdCertificationCheck } =
    usePutFindIdPhoneCertificationCheck(); // 인증번호 확인
  const [account, setAccount] = useState('');

  const form = useForm({
    resolver: zodResolver(phoneNumberFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
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

    try {
      const result = await postFindIdCertification({
        name: form.getValues('name'),
        phone: form.getValues('phone'),
      });

      if (result) {
        // 5분
        const newExpireTimestamp = new Date().getTime() + 5 * 60 * 1000;
        setExpireTimestamp(newExpireTimestamp);

        toast.success('인증번호가 휴대번호로 전송되었습니다.');
        setButtonText('인증번호 확인');
        setIsCertNumVisible(true);
      }
    } catch (error) {
      const errorData = error as ErrorData;
      if (errorData?.code === 4001) {
        setError('phone', {
          type: 'manual',
          message: '휴대전화 번호를 입력해 주세요.',
        });
      } else {
        alert({
          title: '일치하는 계정을 찾을 수 없습니다.',
          description: (
            <div className="flex w-full flex-col">
              <span className="font-body1 text-center text-gray-500">
                입력하신 이름과 휴대번호가 일치하지 않습니다. 가입 시 입력한
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
      const result = await putFindIdCertificationCheck({
        name: form.getValues('name'),
        phone: form.getValues('phone'),
        certificationNumber: form.getValues('certificationNumber'),
      });

      if (result?.data?.isVerified) {
        setIsValid(true);
        clearErrors('certificationNumber');
        setButtonText('인증 완료');
        setAccount(result.data.account);
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
      } else if (errorData.code === 4003) {
        alert({
          title: '일치하는 계정을 찾을 수 없습니다.',
          description: (
            <div className="flex w-full flex-col">
              <span className="font-body1 text-center text-gray-500">
                입력하신 이름과 휴대번호가 일치하지 않습니다. 가입 시 입력한
                정보가 맞는지 다시 한번 확인해 주세요.
              </span>
            </div>
          ),
          cancelButton: null,
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="mt-8 flex flex-col gap-5">
            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              label="이름"
              placeholder="이름 입력"
              name="name"
            />
            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="phone"
              label="휴대번호"
              placeholder="‘-’를 제외하고 입력"
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

          <CButton
            type="button"
            buttonType="contained"
            text={buttonText}
            onClick={
              buttonText === '인증번호 요청' || buttonText === '인증번호 재전송'
                ? startTimer
                : handleVerifyCertNum
            }
            disabled={buttonText === '인증 완료'}
            className="mt-3 w-full"
          />
        </form>
      </Form>

      <CButton
        buttonType="contained"
        text="확인"
        onClick={form.handleSubmit(onSubmit)}
        className={`mt-[80px] w-full rounded px-4 py-2 ${
          formState.isValid && isValid
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 text-gray-400'
        }`}
        disabled={!formState.isValid}
      />
    </>
  );
};

export default FindIdPhone;
