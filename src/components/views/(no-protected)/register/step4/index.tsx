'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep4Schema } from '../schema';

import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetTermsDetail } from '@/hook/terms/useGetTermsDetail';
import { useGetTermsList } from '@/hook/terms/useGetTermsList';

const Step4 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: termsList } = useGetTermsList();
  const [isOpen, setIsOpen] = useState(false);
  const [uuid, setUuid] = useState('');
  const { data: termsContent } = useGetTermsDetail(uuid);

  // Create dynamic form with default values
  const form = useForm<any>({
    resolver: zodResolver(registerStep4Schema),
    defaultValues: {
      agreedTermIds: [],
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

  // Check if all required terms are checked
  const areRequiredTermsChecked = () => {
    if (!termsList?.data?.content) return false;

    const requiredTerms = termsList.data.content.filter(
      (item) => item.isRequired,
    );

    return requiredTerms.every((term) => Boolean(watch(term.id)));
  };

  // Handle the agreeAll checkbox changes
  const handleAgreeAll = (checked: boolean) => {
    setValue('agreeAll', checked);

    // Set all terms checkboxes to the same value
    if (termsList?.data?.content) {
      termsList.data.content.forEach((item) => {
        setValue(item.id, checked);
      });

      // Update agreedTermIds array
      if (checked) {
        // Add all term IDs
        const allTermIds = termsList.data.content.map((item) => item.id);
        setValue('agreedTermIds', allTermIds);
      } else {
        // Clear all term IDs
        setValue('agreedTermIds', []);
      }
    }
  };

  const handleOpenAgreeModal = (uuid: string) => {
    setIsOpen(true);
    setUuid(uuid);
  };

  const { formState } = form;

  const onSubmit = () => {
    const payload = form.getValues();
    console.log(payload);

    router.push(
      `/register/step5?email=${searchParams.get('email')}&password=${searchParams.get('password')}&name=${searchParams.get('name')}&agreedTermIds=${payload.agreedTermIds.join(',')}`,
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="flex py-3">
        <span onClick={() => router.back()}>
          <Icons.ArrowBackIos className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="mt-10">
        <p className="font-l-1 text-black">서비스 이용약관에 동의해주세요.</p>
      </div>

      <div className="mt-[48px] flex flex-1 flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 px-4"
          >
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

            {termsList?.data?.content.map((item) => (
              <div className="flex items-center justify-between" key={item.id}>
                <FormFields
                  fieldType={FormFieldType.CHECKBOX}
                  control={control}
                  name={item.id}
                  checkboxLabel={
                    <span className="font-s-1 flex gap-1 text-gray-08">
                      <span className="text-sand-07">
                        {item.isRequired ? '[필수]' : '[선택]'}
                      </span>
                      {item.title}
                    </span>
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(item.id, e.target.checked);

                    // Update agreedTermIds array
                    const currentAgreedTermIds =
                      form.getValues('agreedTermIds');
                    if (e.target.checked) {
                      // Add item.id if checked and not already in array
                      if (!currentAgreedTermIds.includes(item.id)) {
                        setValue('agreedTermIds', [
                          ...currentAgreedTermIds,
                          item.id,
                        ]);
                      }
                    } else {
                      // Remove item.id if unchecked
                      setValue(
                        'agreedTermIds',
                        currentAgreedTermIds.filter(
                          (id: string) => id !== item.id,
                        ),
                      );
                    }

                    if (termsList?.data?.content) {
                      const allChecked = termsList.data.content.every((term) =>
                        Boolean(watch(term.id)),
                      );
                      setValue('agreeAll', allChecked);
                    }
                  }}
                  required={item.isRequired}
                />
                {item.isExistDetail && (
                  <Button
                    variant="buttonIconTextOnly"
                    size="buttonIconMedium"
                    onClick={() => handleOpenAgreeModal(item.id)}
                  >
                    <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
                  </Button>
                )}
              </div>
            ))}
          </form>
        </Form>
      </div>

      <div className="pb-[52px]">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          disabled={!areRequiredTermsChecked()}
          className="w-full"
        >
          다음
        </Button>
      </div>

      {/* <CustomAlertDialog
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title={termsContent?.title}
      >
        <div>{termsContent?.content}</div>
      </CustomAlertDialog> */}
    </div>
  );
};

export default Step4;
