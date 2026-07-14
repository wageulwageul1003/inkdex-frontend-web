'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep4Schema, TRegisterStep4Schema } from '../schema';

import { CustomModal } from '@/components/shared/custom-modal';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetTermsDetail } from '@/hooks/terms/useGetTermsDetail';
import { useGetTermsList } from '@/hooks/terms/useGetTermsList';

const Step4 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: termsList } = useGetTermsList();

  const [isOpen, setIsOpen] = useState(false);
  const [uuid, setUuid] = useState('');

  const { data: termsContent } = useGetTermsDetail(uuid);

  const form = useForm<TRegisterStep4Schema>({
    resolver: zodResolver(registerStep4Schema),
    defaultValues: {
      agreeAll: false,
      agreedTermUuids: [],
    },
  });

  const { control, setValue, watch } = form;

  const agreedTermUuids = watch('agreedTermUuids');

  /**
   * 전체 동의 체크 여부
   */
  const areRequiredTermsChecked = () => {
    if (!termsList?.data) return false;

    const requiredTerms = termsList.data.filter((item) => item.isRequired);

    return requiredTerms.every((term) => agreedTermUuids.includes(term.uuid));
  };

  /**
   * 전체 동의
   */
  const handleAgreeAll = (checked: boolean) => {
    setValue('agreeAll', checked);

    if (!termsList?.data) return;

    if (checked) {
      setValue(
        'agreedTermUuids',
        termsList.data.map((item) => item.uuid),
      );
    } else {
      setValue('agreedTermUuids', []);
    }
  };

  /**
   * 개별 약관 체크
   */
  const handleTermChange = (uuid: string, checked: boolean) => {
    const current = form.getValues('agreedTermUuids');

    if (checked) {
      if (!current.includes(uuid)) {
        setValue('agreedTermUuids', [...current, uuid]);
      }
    } else {
      setValue(
        'agreedTermUuids',
        current.filter((item) => item !== uuid),
      );
    }

    if (termsList?.data) {
      const allChecked = termsList.data.every((term) =>
        checked
          ? [...current, uuid].includes(term.uuid)
          : current.filter((item) => item !== uuid).includes(term.uuid),
      );

      setValue('agreeAll', allChecked);
    }
  };

  const handleOpenAgreeModal = (uuid: string) => {
    setUuid(uuid);
    setIsOpen(true);
  };

  const onSubmit = () => {
    const payload = form.getValues();

    router.push(
      `/register/step5?email=${searchParams.get('email')}&password=${searchParams.get('password')}&confirmPassword=${searchParams.get('confirmPassword')}&name=${searchParams.get('name')}&agreedTermUuids=${payload.agreedTermUuids.join(',')}`,
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormFields
            fieldType={FormFieldType.CHECKBOX}
            control={control}
            name="agreeAll"
            checkboxLabel={<span>약관 전체 동의</span>}
            onChange={(e) => handleAgreeAll(e.target.checked)}
          />

          {termsList?.data.map((item) => (
            <div key={item.uuid} className="flex items-center justify-between">
              <FormFields
                fieldType={FormFieldType.CHECKBOX}
                control={control}
                name="agreeAll"
                checkboxLabel={
                  <span>
                    {item.isRequired ? '[필수]' : '[선택]'}
                    {item.title}
                  </span>
                }
                onChange={(e) => handleTermChange(item.uuid, e.target.checked)}
              />

              {item.isRequired && (
                <Button
                  type="button"
                  onClick={() => handleOpenAgreeModal(item.uuid)}
                >
                  <Icons.keyboardArrowRight />
                </Button>
              )}
            </div>
          ))}
        </form>
      </Form>

      <Button
        disabled={!areRequiredTermsChecked()}
        onClick={form.handleSubmit(onSubmit)}
      >
        다음
      </Button>

      <CustomModal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title={termsContent?.data.title ?? ''}
        description={termsContent?.data.content ?? ''}
        isCancelButton={false}
      />
    </div>
  );
};

export default Step4;
