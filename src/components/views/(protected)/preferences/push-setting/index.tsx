'use client';

import { useRouter } from 'next/navigation';

import { RemindTime } from './_components/RemindTime';

import { Icons } from '@/components/shared/icons';
import { Header } from '@/components/shared/layout/header';
import { Switch } from '@/components/ui/switch';
import {
  BooleanNotificationSettingKey,
  useGetNotificationSetting,
} from '@/hooks/notification/useGetNotificationSetting';
import { usePatchNotificationSetting } from '@/hooks/notification/usePatchNotificationSetting';
import { cn } from '@/lib/utils';

const PUSH_SETTINGS = [
  {
    name: 'remind',
    label: '리마인드 알림',
    items: [{ name: 'remindEnabled', label: '리마인드 알림' }],
  },
  {
    name: 'myRecord',
    label: '내 기록 알림',
    items: [
      { name: 'postLikeEnabled', label: '내 게시물 좋아요 알림' },
      { name: 'commentEnabled', label: '내 게시물 댓글 작성 알림' },
      { name: 'commentLikeEnabled', label: '내 댓글 좋아요 알림' },
      { name: 'replyEnabled', label: '내 댓글 대댓글 알림' },
      { name: 'bookmarkEnabled', label: '내 게시물 북마크 알림' },
    ],
  },
  {
    name: 'follow',
    label: '팔로우 알림',
    items: [{ name: 'followEnabled', label: '새 팔로워 알림' }],
  },
  {
    name: 'marketing',
    label: '마케팅 알림',
    items: [{ name: 'marketingEnabled', label: '마케팅 정보 알림' }],
  },
];

export const PushSettingComponent = () => {
  const router = useRouter();

  const { data: notificationSetting } = useGetNotificationSetting();
  const { mutateAsync: patchNotificationSetting } =
    usePatchNotificationSetting();

  const handleSwitchChange = (
    checked: boolean,
    name: BooleanNotificationSettingKey,
  ) => {
    patchNotificationSetting({
      slug: name,
      booleanValue: checked,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-white px-4">
      <Header
        left={
          <Icons.ArrowBackIos
            className="size-6 fill-gray-06"
            onClick={() => router.back()}
          />
        }
        title={<span className="font-m-1 text-black">알림 설정</span>}
      />

      <div className="mt-4">
        {PUSH_SETTINGS.map((section, index) => (
          <div
            key={section.name}
            className={cn(
              index !== 0 && 'border-b border-gray-01 py-6',
              index === 0 && 'border-b border-gray-01 pb-6',
              index === PUSH_SETTINGS.length - 1 && 'border-b-0',
            )}
          >
            <span className="font-xs-1 text-gray-05">{section.label}</span>

            <div className="mt-3 space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <span className="font-s-2 text-black">{item.label}</span>
                  <Switch
                    checked={
                      notificationSetting?.[
                        item.name as BooleanNotificationSettingKey
                      ] ?? false
                    }
                    onCheckedChange={(checked) => {
                      handleSwitchChange(
                        checked,
                        item.name as BooleanNotificationSettingKey,
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            {section.name === 'remind' && (
              <div className="flex flex-col gap-1">
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-s-2 text-black">
                    리마인드 알림 시간 설정
                  </span>
                  <RemindTime
                    selectedRemindTime={notificationSetting?.remindTime}
                  />
                </div>
                <span className="font-s-2 rounded-lg bg-gray-01 px-4 py-2 text-gray-06">
                  원하는 시간에 리마인드 알림을 설정할 수 있어요! <br />
                  필사를 꾸준히 이어가는 데 도움이 돼요.
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
