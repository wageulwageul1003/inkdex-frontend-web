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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PERMISSION_SHOWN } from '@/constants/tokens';

const permissions = [
  {
    title: '알림',
    isRequired: false,
    description: '앱 알림',
    icon: 'bell',
  },
  {
    title: '카메라',
    isRequired: false,
    description:
      '게시글 작성, 콘텐츠 등록 시 <br />사진 촬영과 이미지 등 콘텐츠 접근',
    icon: 'camera',
  },
  {
    title: '사진',
    isRequired: false,
    description: '이미지 직접 저장 권한, 사진 첨부',
    icon: 'photo',
  },
];

const permissionDescription = [
  '선택적 접근 권한은 관련 기능 이용 시 동의를 받고 있으며, 비허용시에도 해당 기능 외 서비스 이용이 가능합니다.',
  '휴대폰 “설정 메뉴 > 잉덱스 앱 > 잉덱스 접근 허용”에서 권한 설정을 변경할 수 있습니다. ',
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
    Cookies.set(PERMISSION_SHOWN, 'true');
    setOpen(false);
    router.push('/login');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} disableOverlayClick={true}>
      <DialogContent showCloseButton={false} closeOnOverlayClick={false}>
        <DialogHeader>
          <DialogTitle className="text-center">앱 접근 권한 안내</DialogTitle>
        </DialogHeader>

        <div className="mt-5 flex flex-col space-y-7 pb-8">
          {permissions.map((permission) => (
            <div key={permission.title} className="flex items-start gap-4">
              <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-sand-01">
                {Icons[permission.icon as keyof typeof Icons] &&
                  React.createElement(
                    Icons[permission.icon as keyof typeof Icons],
                    { className: 'size-6 fill-sand-08' },
                  )}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <p className="font-s-1 text-gray-08">{permission.title}</p>
                  <p className="font-s-1 text-sand-07">
                    {permission.isRequired ? '[필수]' : '[선택]'}
                  </p>
                </div>
                <p
                  className="font-xs-1 mt-1 text-gray-05"
                  dangerouslySetInnerHTML={{ __html: permission.description }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-02 py-5">
          {permissionDescription.map((desc, index) => (
            <div key={index} className="flex items-start">
              <Icons.ellipse className="size-4 fill-gray-05" />
              <p className="font-xs-2 text-gray-05">{desc}</p>
            </div>
          ))}
        </div>

        <DialogFooter className="py-3">
          <Button onClick={onClickConfirm} size="lg" variant="contained">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
