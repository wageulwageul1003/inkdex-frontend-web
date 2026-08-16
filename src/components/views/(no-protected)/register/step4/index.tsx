'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { registerStep4Schema, TRegisterStep4Schema } from '../schema';

import { CustomModal } from '@/components/shared/CustomModal';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetTermsDetail } from '@/hooks/terms/useGetTermsDetail';
import { useGetTermsList } from '@/hooks/terms/useGetTermsList';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/shared/Loading';

const Step4 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: termsList, isLoading } = useGetTermsList();

  const [isOpen, setIsOpen] = useState(false);
  const [uuid, setUuid] = useState('');

  const { data: termsContent, isLoading: isLoadingTermsContent } =
    useGetTermsDetail(uuid);

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

    if (searchParams.get('provider') === 'EMAIL') {
      router.push(
        `/register/step5?email=${searchParams.get('email')}&password=${searchParams.get('password')}&confirmPassword=${searchParams.get('confirmPassword')}&name=${searchParams.get('name')}&agreedTermUuids=${payload.agreedTermUuids.join(',')}&provider=${searchParams.get('provider')}`,
      );
    } else {
      router.push(
        `/register/step5?email=${searchParams.get('email')}&name=${searchParams.get('name')}&agreedTermUuids=${payload.agreedTermUuids.join(',')}&provider=${searchParams.get('provider')}&providerId=${searchParams.get('providerId')}`,
      );
    }
  };

  if (isLoading || isLoadingTermsContent) return <Loading />;

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="flex py-3">
        <span onClick={() => router.back()}>
          <Icons.ArrowBackIos className="size-6 fill-gray-06" />
        </span>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <p className="font-l-1 text-black">서비스 이용약관에 동의해주세요.</p>
      </div>

      <div className="mt-12 flex flex-1 flex-col pb-[52px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormFields
              fieldType={FormFieldType.CHECKBOX}
              control={control}
              name="agreeAll"
              checkboxLabel={
                <span className="font-m-1 text-gray-08">약관 전체 동의</span>
              }
              onChange={(e) => handleAgreeAll(e.target.checked)}
              fieldClassName="px-4 py-3"
            />

            <span className="mt-2" />

            {termsList?.data.map((item) => (
              <div
                key={item.uuid}
                className="flex items-center justify-between space-y-2"
              >
                <FormFields
                  fieldType={FormFieldType.CHECKBOX}
                  control={control}
                  name="agreeAll"
                  checkboxLabel={
                    <span
                      className={cn(
                        'font-s-1',
                        item.isRequired ? 'text-sand-07' : 'text-gray-05',
                      )}
                    >
                      {item.isRequired ? '[필수]' : '[선택]'}
                      <span className="ml-1 text-gray-08">{item.title}</span>
                    </span>
                  }
                  onChange={(e) =>
                    handleTermChange(item.uuid, e.target.checked)
                  }
                  fieldClassName="px-4"
                />

                {item.isRequired && (
                  <Button
                    type="button"
                    variant="buttonIconTextOnly"
                    size="buttonIconMedium"
                    onClick={() => handleOpenAgreeModal(item.uuid)}
                  >
                    <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
                  </Button>
                )}
              </div>
            ))}
          </form>
        </Form>

        <Button
          disabled={!areRequiredTermsChecked()}
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          className="mt-auto w-full"
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
    </div>
  );
};

export default Step4;
