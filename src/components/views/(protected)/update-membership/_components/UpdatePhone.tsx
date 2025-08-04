import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import CButton from '@/components/shared/CButton';
import CIconButton from '@/components/shared/IconButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import {
  registerStep2Schema,
  TRegisterStep2Schema,
} from '@/components/views/(no-protected)/register/schema';
import { usePostMypageCertification } from '@/hooks/auth/mypage/usePostMypageCertification';
import { usePutChangePhone } from '@/hooks/auth/mypage/usePutChangePhone';
import { usePutMypageCertificationCheck } from '@/hooks/auth/mypage/usePutMypageCertificationCheck';
import { ErrorData } from '@/utils/fetch';

const UpdatePhoneDialog: React.FC = () => {
  const [isValid, setIsValid] = useState(false); // 인증번호의 유효성
  const [buttonText, setButtonText] = useState('인증번호 요청');
  const [isCertNumVisible, setIsCertNumVisible] = useState(false); // 인증번호 입력 필드 표시 여부
  const [expireTimestamp, setExpireTimestamp] = useState<number | null>(null); // 타이머 만료 타임스탬프
  const [open, setOpen] = useState(false); // 다이얼로그 열림/닫힘 상태
  const { mutate: postMypageCertification } = usePostMypageCertification(); // 인증번호 요청
  const { mutateAsync: putMypageCertificationCheck } =
    usePutMypageCertificationCheck(); // 인증번호 확인
  const { mutateAsync: putChangePhone } = usePutChangePhone(); // 휴대폰 변경
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerStep2Schema),
    mode: 'onChange',
    defaultValues: {
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

  const onSubmit = async (values: TRegisterStep2Schema) => {
    if (isValid) {
      try {
        const result = await putChangePhone({
          newPhone: values.phone,
        });

        if (result?.code === 2000) {
          toast.success('휴대번호가 성공적으로 변경되었습니다.');
          // 다이얼로그 닫기
          setOpen(false);
          router.refresh();
        }
      } catch (error) {
        const errorData = error as ErrorData;
        toast.error(
          errorData?.message || '휴대번호 변경 중 오류가 발생했습니다.',
        );
      }
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

    toast.success('인증번호가 휴대번호로 전송되었습니다.');
    setButtonText('인증번호 확인');
    setIsCertNumVisible(true);
    postMypageCertification({ phone: form.getValues('phone') });
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
      const result = await putMypageCertificationCheck({
        phone: form.getValues('phone'),
        certificationNumber: form.getValues('certificationNumber'),
      });

      if (result?.code === 2000) {
        setIsValid(true);
        clearErrors('certificationNumber');
        setButtonText('인증 완료');
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CButton
          type="button"
          buttonType="outlined"
          text="휴대번호 변경"
          className="mt-2 w-full"
        />
      </DialogTrigger>
      <DialogContent className="lg:max-w-lg">
        <DialogHeader className="flex items-center justify-between border-b border-gray-200 py-1">
          <DialogTitle>휴대번호 변경</DialogTitle>
          <DialogClose>
            <CIconButton
              buttonType="only"
              size="small"
              icon={<Icons.close className="h-m w-m shrink-0 fill-gray-700" />}
            />
          </DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
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

            <CButton
              type="button"
              buttonType="contained"
              className="mt-3 w-full"
              text={buttonText}
              onClick={
                buttonText === '인증번호 요청' ||
                buttonText === '인증번호 재전송'
                  ? startTimer
                  : handleVerifyCertNum
              }
              disabled={buttonText === '인증 완료'}
            />
          </form>
        </Form>
        <DialogFooter className="mt-8 flex h-fit items-center justify-between gap-2">
          <CButton
            text="변경 취소"
            buttonType="outlined"
            className="w-full"
            onClick={() => setOpen(false)}
          />

          <CButton
            text="휴대번호 변경"
            buttonType="contained"
            onClick={handleSubmit(onSubmit)}
            className={`w-full rounded px-4 py-2 ${
              formState.isValid && isValid
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
            disabled={!(formState.isValid && isValid)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePhoneDialog;
