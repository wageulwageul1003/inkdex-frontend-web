export interface NotificationPayloadMap {
  FOLLOWER: {
    nickname: string;
  };

  POST_LIKE: {
    nickname: string;
    postUuid: string;
  };

  POST_COMMENT: {
    nickname: string;
    postUuid: string;
  };

  REMIND: undefined;

  MARKETING: {
    message: string;
  };
}
