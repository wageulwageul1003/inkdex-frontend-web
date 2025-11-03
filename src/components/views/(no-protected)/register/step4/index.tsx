'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep1Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetTermsList } from '@/hook/terms/useGetTermsList';

const Step4 = () => {
  const router = useRouter();
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

  const { formState } = form;

  const onSubmit = () => {
    console.log(form.getValues());
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="flex py-3">
        <span onClick={() => router.back()}>
          <Icons.ArrowBackIos className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <p className="font-l-1 text-black">이름을 입력해주세요.</p>
        <p className="font-xs-2 text-gray-06">
          계정 식별 및 서비스 이용에 사용됩니다.
        </p>
      </div>

      <div className="mt-[50px] flex flex-1 flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <div className="mb-4">
              <FormFields
                fieldType={FormFieldType.CHECKBOX}
                control={control}
                name="agreeAll"
                checkboxLabel={
                  <span className="font-m-1 text-gray-08">약관 전체 동의</span>
                }
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
                  <FormFields
                    fieldType={FormFieldType.CHECKBOX}
                    control={control}
                    name={item.id}
                    checkboxLabel={
                      <span className="font-s-1 text-gray-08">
                        <span className="text-gray-07">
                          {item.isRequired ? '[필수]' : '[선택]'}
                        </span>
                        {item.title}
                      </span>
                    }
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
                  <Button
                    variant="textOnly"
                    size="sm"
                    className="h-fit w-fit p-0"
                  >
                    <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
                  </Button>
                </div>
              ))}
            </div>
          </form>
          {/* <Button
            type="submit"
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
          </Button> */}
        </Form>
      </div>

      <div className="pb-[52px]">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          disabled={!formState.isValid}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default Step4;
