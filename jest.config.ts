import nextJest from 'next/jest.js';
import type { Config } from 'jest';

// Next.js 프로젝트 디렉토리 설정
const createJestConfig = nextJest({
  dir: './',
});

// custom Jest 설정
const customJestConfig: Config = {
  testEnvironment: 'jsdom',

  // 모듈 경로 매핑
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 테스트 실행 전에 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // 테스트 리포트 설정 (HTML)
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: 'reports/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],

  // 커버리지 수집 설정
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
};

// nextJest를 통해 Jest 설정 생성 후 export
export default createJestConfig(customJestConfig);
