'use client';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Button } from '@/components/ui/button';
import {
  ITermsListResponse,
  useGetTermsList,
} from '@/hooks/terms/useGetTermsList';

export const InfoComponent = () => {
  const router = useRouter();
  const { data } = useGetTermsList();
  return (
    <div className="flex w-full flex-col px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 stroke-gray-02"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">정보</span>}
      />
      <div className="mt-4 flex flex-1 flex-col">
        {data?.data?.content
          ?.filter((item: ITermsListResponse) => item.isExistDetail)
          .map((item, index, arr) => (
            <div
              key={item.id}
              className={`flex items-center justify-between border-b border-gray-01 py-2`}
            >
              <div className="flex items-center gap-2">
                <p className="font-m-1 text-gray-09">{item.title}</p>
              </div>
              <Button
                variant="buttonIconTextOnly"
                size="buttonIconMedium"
                onClick={() => router.push(`/preferences/info/${item.id}`)}
              >
                <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
              </Button>
            </div>
          ))}

        <div className={`flex items-center justify-between py-2`}>
          <div className="flex items-center gap-2">
            <p className="font-m-1 text-gray-09">버전</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-m-2 text-gray-07">1.0.0</p>
            <Button
              variant="buttonIconTextOnly"
              size="buttonIconMedium"
              onClick={() => router.push(`/preferences/info/version`)}
            >
              <Icons.keyboardArrowRight className="size-6 fill-gray-08" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
