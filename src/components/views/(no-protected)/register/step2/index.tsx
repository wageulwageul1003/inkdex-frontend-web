'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FieldState } from '../_components/field-state';
import { registerStep2Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetNicknameDuplicateCheck } from '@/hook/auth/useGetNicknameDuplicateCheck';
import { usePostConfirmEmail } from '@/hook/auth/usePostConfirmEmail';
import { usePostRegister } from '@/hook/auth/usePostRegister';
import { usePostVerifyEmail } from '@/hook/auth/usePostVerifyEmail';
import { hasKorean, hasLetter, hasNumber, hasSpecial } from '@/lib/utils';
import { ErrorData } from '@/utils/fetch';

const Step2 = () => {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false); // 인증번호의 유효성
  const [buttonText, setButtonText] = useState('인증번호 요청');
  const [isCertNumVisible, setIsCertNumVisible] = useState(false); // 인증번호 입력 필드 표시 여부
  const [expireTimestamp, setExpireTimestamp] = useState<number | null>(null); // 타이머 만료 타임스탬프
  const { mutateAsync: postVerifyEmail } = usePostVerifyEmail(); // 인증번호 요청
  const { mutateAsync: postConfirmEmail } = usePostConfirmEmail(); // 인증번호 확인
  const { mutateAsync: postRegister } = usePostRegister(); // 회원가입

  const searchParams = useSearchParams();

  // 비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState({
    length: false, // 8자 이상 20자 이하
    combination: false, // 영문, 숫자, 특수문자 조합
  });

  // 닉네임 유효성 검사 상태
  const [nicknameValidation, setNicknameValidation] = useState({
    isSpecial: false, // 특수문자 제외
    combination: false, // 2자 이상 8자 이하, 영문, 숫자
    duplicate: false, // 중복
  });

  const form = useForm({
    resolver: zodResolver(registerStep2Schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
      nickname: '',
      password: '',
      agreedTermIds: searchParams.get('agreedTermIds')?.split(',') || [],
    },
  });

  const { data: nicknameDuplicateCheck } = useGetNicknameDuplicateCheck(
    form.watch('nickname'),
  );

  const {
    control,
    formState,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    watch,
  } = form;

  // 비밀번호 유효성 검사 함수
  const validatePassword = (value: string) => {
    // 비밀번호가 비어있으면 모든 검증을 false로 처리
    if (!value) {
      setPasswordValidation({
        length: false,
        combination: false,
      });
      return;
    }

    // 길이 검사 (8자 이상 20자 이하)
    const isLengthValid = value.length >= 8 && value.length <= 20;

    // 영문, 숫자, 특수문자 조합 검사
    const isCombinationValid =
      hasLetter(value) && hasNumber(value) && hasSpecial(value);

    setPasswordValidation({
      length: isLengthValid,
      combination: isCombinationValid,
    });
  };

  // 닉네임 유효성 검사 함수
  const validateNickname = (value: string) => {
    // 닉네임이 비어있으면 모든 검증을 false로 처리
    if (!value) {
      setNicknameValidation({
        isSpecial: false,
        combination: false,
        duplicate: false,
      });
      return;
    }

    // 길이 검사 (2자 이상 8자 이하)
    const isLengthValid = value.length >= 2 && value.length <= 8;
    // 영문 또는 한글
    const isCombinationValid =
      (hasLetter(value) || hasKorean(value)) && isLengthValid;

    // 특수문자 포함 검사
    const isSpecialValid = !hasSpecial(value);

    // 중복 검사 (코드 200은 중복이 없다는 의미이므로 true로 설정해야 함)
    // 닉네임이 2자 미만이면 중복 체크를 하지 않음
    const isDuplicateValid =
      value.length < 2 ? false : nicknameDuplicateCheck?.code === 200;

    setNicknameValidation({
      isSpecial: isSpecialValid,
      combination: isCombinationValid,
      duplicate: isDuplicateValid,
    });
  };

  // 초기 비밀번호 값 검증
  useEffect(() => {
    validatePassword(form.getValues('password'));
    validateNickname(form.getValues('nickname'));
  }, []);

  // nicknameDuplicateCheck 데이터가 변경될 때 닉네임 유효성 검사 다시 실행
  useEffect(() => {
    validateNickname(form.getValues('nickname'));
  }, [nicknameDuplicateCheck]);

  // 비밀번호 필드에 대한 onChange 핸들러 등록
  form.register('password', {
    onChange: (e) => validatePassword(e.target.value),
  });

  // 닉네임 필드에 대한 onChange 핸들러 등록
  form.register('nickname', {
    onChange: (e) => validateNickname(e.target.value),
  });

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
          message: '입력 유효 시간이 초과되었습니다. 다시 요청해주세요.',
        });
        setButtonText('인증번호 재전송');
        setIsValid(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTimestamp, isCertNumVisible, buttonText, setError]);

  const onSubmit = () => {
    console.log(form.getValues());

    postRegister(form.getValues());
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

    clearErrors('code');

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
    }
  };

  const handleVerifyCertNum = async () => {
    const now = Date.now();

    if (expireTimestamp && now > expireTimestamp) {
      setError('code', {
        type: 'manual',
        message: '입력 유효 시간이 초과되었습니다. 다시 요청해주세요.',
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
      }
    } catch (error) {
      const errorData = error as ErrorData;
      if (errorData?.code === 4001) {
        setError('code', {
          type: 'manual',
          message: '입력 유효 시간이 초과되었습니다. 다시 요청해주세요.',
        });
      } else if (errorData?.code === 400) {
        setError('code', {
          type: 'manual',
          message: '인증번호가 일치하지 않습니다.',
        });
      }
    }
  };

  return (
    <>
      <Header
        title={<span>이메일 회원가입</span>}
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
            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="이메일"
              placeholder="이메일 입력"
            />

            {buttonText === '인증 완료' && (
              <FieldState text="인증 완료되었습니다." isError={false} />
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
                disabled={buttonText === '인증 완료'}
              />
            )}

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

            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="영문, 숫자, 특수문자 조합 8자 이상"
            />

            <div className="mt-2 space-y-1">
              <FieldState
                text="8자 이상 20자 이하 입력"
                isError={!passwordValidation.length}
              />
              <FieldState
                text="영문, 숫자, 특수문자 조합"
                isError={!passwordValidation.combination}
              />
            </div>

            <FormFields
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="nickname"
              label="닉네임"
              placeholder="닉네임 입력"
              required
            />

            <div className="mt-2 space-y-1">
              <FieldState
                text="특수문자 제외"
                isError={!nicknameValidation.isSpecial}
              />
              <FieldState
                text="국문, 영문 2자 이상 8자 이하 입력"
                isError={!nicknameValidation.combination}
              />
              <FieldState
                text="사용 가능한 닉네임"
                isError={!nicknameValidation.duplicate}
              />
            </div>
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
        size="cta"
        variant="cta"
        disabled={!formState.isValid}
      >
        가입하기
      </Button>
    </>
  );
};

export default Step2;
