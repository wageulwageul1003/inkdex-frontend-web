import { Icons } from '@/components/shared/icons';

export const VISIBILITY = [
  {
    label: '전체 공개',
    icon: <Icons.worldMap className="size-5 fill-gray-06" />,
    value: 'PUBLIC',
  },
  {
    label: '팔로워 공개',
    icon: <Icons.users className="size-5 fill-gray-06" />,
    value: 'FOLLOWERS',
  },
  {
    label: '나만 보기',
    icon: <Icons.lock className="size-5 fill-gray-06" />,
    value: 'PRIVATE',
  },
];

export type VisibilityType = (typeof VISIBILITY)[number]['value'];
