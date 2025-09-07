'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep1Schema } from '../schema';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import Checkbox from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useGetTermsList } from '@/hook/terms/useGetTermsList';

export default function Step1() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const { data: termsList } = useGetTermsList();

  // Create dynamic form with default values
  const form = useForm<any>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      agreeAll: false,
    },
  });

  const { control, setValue, watch } = form;

  // Initialize form fields based on terms data
  useEffect(() => {
    if (termsList?.data?.content) {
      const defaultValues: Record<string, boolean> = {
        agreeAll: false,
      };

      // Add each term to default values
      termsList.data.content.forEach((item) => {
        defaultValues[item.id] = false;
      });

      form.reset(defaultValues);
    }
  }, [termsList, form]);

  // Handle the agreeAll checkbox changes
  const handleAgreeAll = (checked: boolean) => {
    setValue('agreeAll', checked);

    // Set all terms checkboxes to the same value
    if (termsList?.data?.content) {
      termsList.data.content.forEach((item) => {
        setValue(item.id, checked);
      });
    }
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const onClickAgreeTerm = (uuid: string) => {
    router.push('/terms/' + uuid);
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
              <div className="mb-4">
                <Checkbox
                  label="모두 동의"
                  checked={Boolean(watch('agreeAll'))}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAgreeAll(e.target.checked)
                  }
                />
              </div>
              <div className="mt-4 flex flex-col gap-4 pb-5">
                {termsList?.data?.content.map((item) => (
                  <div
                    className="flex items-center justify-between"
                    key={item.id}
                  >
                    <Checkbox
                      label={item.title}
                      checked={Boolean(watch(item.id))}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue(item.id, e.target.checked);

                        if (termsList?.data?.content) {
                          const allChecked = termsList.data.content.every(
                            (term) => Boolean(watch(term.id)),
                          );
                          setValue('agreeAll', allChecked);
                        }
                      }}
                      required={item.isRequired}
                    />
                    <div
                      className="flex items-center"
                      onClick={() => onClickAgreeTerm(item.id)}
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
              onClick={() => {
                // 체크된 약관 ID들을 수집
                const checkedTerms = termsList?.data?.content
                  .filter((item) => Boolean(watch(item.id)))
                  .map((item) => item.id);

                // URL 파라미터로 전달
                router.push(
                  `/register/step2?agreedTermIds=${checkedTerms?.join(',')}`,
                );
              }}
            >
              다음으로
            </Button>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
