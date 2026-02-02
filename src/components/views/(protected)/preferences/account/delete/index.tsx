'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { DeleteAccountSchema } from '../schema';

import { CustomAlertDialog } from '@/components/shared/custom-alert-dialog';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export const AccountDeleteComponent = () => {
  const router = useRouter();
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);

  const handleDelete = () => {};

  const form = useForm({
    resolver: zodResolver(DeleteAccountSchema),
    mode: 'onChange',
    defaultValues: {
      reason: '1',
    },
  });

  const onSubmit = async () => {
    setDeleteAlertOpen(true);
  };

  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">회원 탈퇴</span>}
      />
      <div className="mt-7 flex w-full flex-1 flex-col">
        <p className="font-m-1 text-black">회원 탈퇴</p>
        <p className="font-s-2 mt-2 text-gray-06">
          그동안 서비스를 이용해 주셔서 감사합니다. <br />
          탈퇴 사유를 공유해 주시면 더 나은 서비스를 만드는 데 도움이 됩니다.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('Validation Errors:', errors);
            })}
            className="mt-8 flex w-full flex-1"
          >
            <FormFields
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="reason"
              placeholder="탈퇴 사유 선택"
              className="w-full"
            />
          </form>
        </Form>

        <div className="flex flex-col gap-4 pb-[52px]">
          <p className="font-s-2 text-center text-gray-07">
            계정을 삭제하면 모든 활동 정보가 삭제됩니다.
          </p>
          <div className="flex gap-1">
            <Button
              onClick={() => router.back()}
              size="lg"
              variant="outline"
              className="flex-1"
            >
              이전
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              size="lg"
              variant="contained"
              className="flex-1"
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </div>

      <CustomAlertDialog
        isOpen={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        title="정말 탈퇴하겠습니까?"
        description="계정을 삭제하면 모든 활동 정보가 삭제됩니다."
        cancelText="취소"
        confirmText="탈퇴"
        onConfirm={() => handleDelete()}
        onCancel={() => router.back()}
        type="warning"
      ></CustomAlertDialog>
    </div>
  );
};
