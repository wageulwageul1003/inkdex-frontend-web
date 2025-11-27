'use client';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

const ResetPasswordSuccess = () => {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-gray-01 px-4">
      <div className="mt-[160px] flex flex-1 flex-col items-center">
        <Icons.send className="size-12 fill-gray-04" />
        <p className="font-l-1 mt-4 text-black">임시 비밀번호 메일 발송 완료</p>
        <p className="font-xs-2 mt-1 text-center text-gray-06">
          임시 비밀번호가 포함된 메일이 발송되었습니다.
          <br />
          메일함을 확인해주세요.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 pb-[52px]">
        <Button
          onClick={() => router.push('/login')}
          size="lg"
          variant="contained"
          className="w-full"
        >
          로그인 화면으로
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;
