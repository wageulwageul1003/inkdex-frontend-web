export const NOTIFICATION_TYPE = {
  FOLLOWER: 'FOLLOWER',
  POST_LIKE: 'POST_LIKE',
  POST_COMMENT: 'POST_COMMENT',
  REMIND: 'REMIND',
  MARKETING: 'MARKETING',
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export interface NotificationPayloadMap {
  [NOTIFICATION_TYPE.FOLLOWER]: {
    nickname: string;
  };

  [NOTIFICATION_TYPE.POST_LIKE]: {
    nickname: string;
    postUuid: string;
  };

  [NOTIFICATION_TYPE.POST_COMMENT]: {
    nickname: string;
    postUuid: string;
  };

  [NOTIFICATION_TYPE.REMIND]: undefined;

  [NOTIFICATION_TYPE.MARKETING]: {
    message: string;
  };
}

export type NotificationPayload<T extends NotificationType> =
  NotificationPayloadMap[T];
