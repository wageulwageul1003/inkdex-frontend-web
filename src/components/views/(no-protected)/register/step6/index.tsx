'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { registerStep6Schema } from '../schema';

import Chips from '@/components/shared/chips';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { useGetCategoryList } from '@/hook/common/useGetCategoryList';

const Step6 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories } = useGetCategoryList();

  const form = useForm({
    resolver: zodResolver(registerStep6Schema),
    mode: 'onChange',
    defaultValues: {
      categoryIds: [],
    },
  });

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

      <div className="flex flex-1 flex-col">
        <div className="mt-10 flex flex-col gap-3">
          <div>
            <p className="font-l-1 text-black">어디서 마음에 남는 문장을</p>
            <p className="font-l-1 text-black">주로 발견하나요?</p>
          </div>
          <p className="font-xs-2 text-gray-06">
            관심 있는 카테고리를 1개 이상 선택해주세요.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-x-2 gap-y-4">
          <Chips
            items={
              categories?.data?.content.map((item) => ({
                value: item.slug,
                label: item.name,
              })) || []
            }
            variant="multiple"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pb-[52px]">
        <span className="font-s-2 text-gray-07">
          선택한 카테고리는 나중에 변경할 수 있어요!
        </span>

        <Button
          onClick={form.handleSubmit(onSubmit)}
          size="lg"
          variant="contained"
          disabled={!formState.isValid}
          className="w-full"
        >
          완료
        </Button>
      </div>
    </div>
  );
};

export default Step6;
