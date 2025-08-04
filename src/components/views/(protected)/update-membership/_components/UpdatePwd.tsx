import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { TUpdatePwd, updatePwdSchema } from './schema';

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
import { usePatchPasswordReset } from '@/hooks/auth/mypage/usePatchPasswordReset';

const UpdatePwdDialog: React.FC = () => {
  const { mutateAsync: patchPasswordReset } = usePatchPasswordReset();
  const [open, setOpen] = useState(false); // 다이얼로그 열림/닫힘 상태
  const router = useRouter();

  const form = useForm<TUpdatePwd>({
    resolver: zodResolver(updatePwdSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  const { handleSubmit } = form;
  const onSubmit = async (values: TUpdatePwd) => {
    try {
      const result = await patchPasswordReset(values);
      if (result?.code === 2000) {
        toast.success('비밀번호가 성공적으로 변경되었습니다.');
        // 다이얼로그 닫기
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CButton
          type="button"
          buttonType="outlined"
          text="비밀번호 변경"
          className="mt-2 w-full"
        />
      </DialogTrigger>
      <DialogContent className="lg:max-w-lg">
        <DialogHeader className="flex items-center justify-between border-b border-gray-200 py-1">
          <DialogTitle>비밀번호 변경</DialogTitle>
          <DialogClose>
            <CIconButton
              buttonType="only"
              size="small"
              icon={<Icons.close className="h-m w-m shrink-0 fill-gray-700" />}
            />
          </DialogClose>
        </DialogHeader>
        <Form {...form}>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="currentPassword"
              label="비밀번호"
              placeholder="현재 비밀번호 입력"
            />
            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="newPassword"
              label="새 비밀번호"
              placeholder="영문, 숫자, 특수문자 조합 8자 이상"
            />
            <FormFields
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="newPasswordConfirm"
              label="새 비밀번호 확인"
              placeholder="새 비밀번호 재입력"
            />
          </form>
        </Form>
        <DialogFooter className="mt-8">
          <DialogClose asChild>
            <CButton
              text="변경 취소"
              buttonType="outlined"
              className="w-full"
              type="button"
            />
          </DialogClose>

          <DialogClose asChild>
            <CButton
              type="submit"
              text="비밀번호 변경"
              buttonType="contained"
              onClick={handleSubmit(onSubmit)}
              className="w-full"
            />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePwdDialog;
