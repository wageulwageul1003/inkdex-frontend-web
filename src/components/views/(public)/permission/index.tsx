'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const permissions = [
  {
    title: '사진 (선택)',
    description: '게시글 작성 시 사진첨부',
    icon: 'photo',
  },
  {
    title: '카메라 (선택)',
    description: '게시글 작성 시 사진 촬영',
    icon: 'camera',
  },
  {
    title: '알림 (선택)',
    description: '푸시 알림 및 정보 알림 기능에 사용',
    icon: 'bell',
  },
];

export default function Permission() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 쿠키 확인하여 이미 권한 안내를 본 적이 있는지 확인
    const permissionShown = Cookies.get('permission-shown');

    if (permissionShown) {
      // 이미 권한 안내를 본 적이 있으면 메인 페이지로 리다이렉트
      router.push('/login');
    } else {
      // 아직 권한 안내를 본 적이 없으면 다이얼로그 열기
      setOpen(true);
    }
  }, [router]);

  const onClickConfirm = () => {
    // 쿠키에 권한 안내를 본 적이 있다고 저장
    Cookies.set('permission-shown', 'true');
    setOpen(false);
    router.push('/login');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} disableOverlayClick={true}>
      <DialogContent
        className="px-5 pb-5 pt-8"
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        <DialogHeader>
          <DialogTitle className="text-center">앱 접근 권한 안내</DialogTitle>
        </DialogHeader>

        <div className="mt-12 flex flex-col gap-9 pb-7">
          {permissions.map((permission) => (
            <div key={permission.title} className="flex items-center gap-7">
              <div className="size-8 fill-black">
                {Icons[permission.icon as keyof typeof Icons] &&
                  React.createElement(
                    Icons[permission.icon as keyof typeof Icons],
                    { className: 'size-8 fill-black' },
                  )}
              </div>
              <div>
                <p className="">{permission.title}</p>
                <p className="mt-[6px]">{permission.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pb-8 pt-5">
          <p>접근권한 변경 방법</p>
          <p className="mt-2">{`휴대폰 설정 > 인덱스 에서 접근 권한 변경 가능`}</p>
        </div>
        <Button variant="cta" onClick={onClickConfirm}>
          확인
        </Button>
      </DialogContent>
    </Dialog>
  );
}
