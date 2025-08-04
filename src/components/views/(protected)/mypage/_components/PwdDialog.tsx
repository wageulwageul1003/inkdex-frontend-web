'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { IMypasswordValidSchema, TMyPasswordValidSchema } from './schema';

import CButton from '@/components/shared/CButton';
import CIconButton from '@/components/shared/IconButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { NotificationMessage } from '@/components/shared/notification-message/NotificationMessage';
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
import { useGetMyInfo } from '@/hooks/auth/mypage/useGetMyInfo';
import { usePostMyPasswordValid } from '@/hooks/auth/mypage/usePostMyPasswordValid';

const PwdCheckDialog: React.FC = () => {
  const { data: myInfo } = useGetMyInfo();
  const { mutateAsync: postMyPasswordValid } = usePostMyPasswordValid();
  const router = useRouter();

  const form = useForm<TMyPasswordValidSchema>({
    resolver: zodResolver(IMypasswordValidSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (values: TMyPasswordValidSchema) => {
    try {
      const result = await postMyPasswordValid(values);
      if (!result.isValid) {
        toast.error('비밀번호가 일치하지 않습니다.');
      } else {
        router.push(`/mypage/update-membership`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CButton text="회원 정보 수정" size="small" buttonType="outlined" />
      </DialogTrigger>
      <DialogContent className="w-[680px]">
        <DialogHeader className="flex items-center justify-between border-b border-gray-200 py-1">
          <DialogTitle>비밀번호 재확인</DialogTitle>
          <DialogClose>
            <CIconButton
              buttonType="only"
              size="small"
              icon={<Icons.close className="h-m w-m shrink-0 fill-gray-700" />}
            />
          </DialogClose>
        </DialogHeader>
        <div className="mt-4">
          <NotificationMessage text="회원님의 정보 보호를 위해 비밀번호를 재확인하고 있습니다." />
        </div>
        <div className="font-body1-bold mt-8">
          <p>아이디</p>
          <p className="mb-6 mt-2 text-gray-500">{myInfo?.account}</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-2 w-full space-y-5"
            >
              <FormFields
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="비밀번호"
                placeholder="비밀번호 입력"
                required
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="mt-8">
          <CButton
            text="확인"
            buttonType="contained"
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          />
          <DialogClose asChild>
            <CButton text="닫기" buttonType="outlined" />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PwdCheckDialog;
