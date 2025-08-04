'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { registerStep1Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

const agreeData = [
  {
    label: '[필수] 만 14세 이상입니다.',
    value: 'agree1',
    required: true,
  },
  {
    label: '[필수] 서비스 이용약관 동의',
    value: 'agree2',
    required: true,
  },
  {
    label: '[필수] 개인정보 수집 및 이용 동의',
    value: 'agree3',
    required: true,
  },
  {
    label: '[선택] 선택정보 수집 및 이용 동의',
    value: 'agree4',
    required: false,
  },
];

export default function Step1() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const form = useForm<z.infer<typeof registerStep1Schema>>({
    resolver: zodResolver(registerStep1Schema),
  });

  const onSubmit = (data: z.infer<typeof registerStep1Schema>) => {
    console.log(data);
  };

  const onClickAgreeTerm = (uuid: string) => {
    router.push('/terms?uuid=' + uuid);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} disableOverlayClick>
      <SheetContent side="bottom" className="w-full">
        <div className="w-full">
          <SheetTitle className="pt-7 text-center">
            <span>약관 동의</span>
          </SheetTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
              <FormFields
                fieldType={FormFieldType.CHECKBOX}
                checkboxLabel="모두 동의"
                control={form.control}
                name=""
              />
              <div className="mt-4 flex flex-col gap-4 pb-5">
                {agreeData.map((item) => (
                  <div
                    className="flex items-center justify-between"
                    key={item.value}
                  >
                    <FormFields
                      fieldType={FormFieldType.CHECKBOX}
                      control={form.control}
                      name=""
                      checkboxLabel={item.label}
                      required={item.required}
                    />
                    <div
                      className="flex items-center"
                      onClick={() => onClickAgreeTerm(item.value)}
                    >
                      <p className="text-black">보기</p>
                      <Icons.keyboardArrowRight className="size-5 fill-black" />
                    </div>
                  </div>
                ))}
              </div>
            </form>
            <p className="border-t border-gray-300 pt-5 text-gray-600">
              선택 항목에 동의하지 않아도 서비스 이용이 가능합니다. <br />
              개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며 <br />
              동의 거부 시 서비스 이용이 제한됩니다.
            </p>
            <Button
              type="submit"
              variant="cta"
              size="cta"
              className="mb-5 mt-8"
            >
              다음으로
            </Button>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
