export const ERROR_CODES = {
  // Common (1000)
  UUID_NO_EXISTS: {
    code: 1001,
    message: '존재하지 않는 UUID입니다.',
  },
  REQUIRE_DATA: {
    code: 1002,
    message: '필수값이 누락되었습니다.',
  },
  DUPLICATE_DATA: {
    code: 1003,
    message: '중복된 데이터입니다.',
  },

  // Etc
  DELETE_ERROR: {
    code: 1004,
    message: '삭제할 수 없습니다.',
  },

  // Account (3000)
  ACCOUNT_NOT_FOUND: {
    code: 3001,
    message: '존재하지 않는 계정입니다.',
  },
  EMAIL_DUPLICATE: {
    code: 3002,
    message: '이미 사용 중인 이메일입니다.',
  },
  WRONG_EMAIL_PASSWORD: {
    code: 3003,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  WRONG_EMAIL_CODE: {
    code: 3004,
    message: '인증번호가 올바르지 않습니다.',
  },
  CODE_EXPIRED: {
    code: 3005,
    message: '인증번호가 만료되었습니다.',
  },
  REGISTER_REQUIRED_TERMS: {
    code: 3006,
    message: '필수 약관에 모두 동의해야 합니다.',
  },
  PASSWORD_NOT_MATCH: {
    code: 3007,
    message: '비밀번호가 일치하지 않습니다.',
  },
  PASSWORD_DIFFERENT: {
    code: 3008,
    message: '새 비밀번호는 기존 비밀번호와 달라야 합니다.',
  },
  NICKNAME_DUPLICATE: {
    code: 3009,
    message: '이미 사용 중인 닉네임입니다.',
  },
  CANT_SEND_CODE: {
    code: 3010,
    message: '이메일 계정만 인증번호를 발송할 수 있습니다.',
  },
  ALREADY_EMAIL_PROVIDER: {
    code: 3011,
    message: '이미 이메일 계정입니다.',
  },
  ALREADY_LINKED_PROVIDER: {
    code: 3012,
    message: '이미 연동된 계정입니다.',
  },
  EMAIL_NOT_MATCH: {
    code: 3013,
    message: '이메일이 일치하지 않습니다.',
  },
  ACCOUNT_WITHDRAWN: {
    code: 3014,
    message: '탈퇴한 계정입니다.',
  },

  // Post (4000)

  // Collection (5000)

  // Follow (6000)
  FOLLOW_MYSELF: {
    code: 6001,
    message: '자기 자신은 팔로우할 수 없습니다.',
  },
  FOLLOW_ALREADY: {
    code: 6002,
    message: '이미 팔로우한 계정입니다.',
  },

  // Report (7000)
  REPORT_ALREADY: {
    code: 7001,
    message: '이미 신고한 게시글입니다.',
  },

  // File (9000)
  MAX_FILE: {
    code: 9001,
    message: '파일은 최대 5개까지 업로드할 수 있습니다.',
  },
  NO_FILE: {
    code: 9002,
    message: '업로드된 파일이 없습니다.',
  },
} as const;
