import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import Login from './index';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock Icons
jest.mock('@/components/shared/icons', () => ({
  Icons: {
    close: () => <div data-testid="close-icon" />,
    keyboardArrowRight: () => <div data-testid="arrow-right-icon" />,
    email: () => <div data-testid="email-icon" />,
  },
}));

// Mock Button
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.join(' '),
}));

describe('Login 컴포넌트', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('로그인 화면이 렌더링 된다', () => {
    render(<Login />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('로그인/회원가입')).toBeInTheDocument();
    [
      '카카오로 시작하기',
      'Apple로 시작하기',
      '구글로 시작하기',
      '이메일로 시작하기',
      '로그인 없이 둘러보기',
    ].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('닫기 아이콘 클릭 시 /home으로 이동', () => {
    render(<Login />);
    fireEvent.click(screen.getByTestId('close-icon'));
    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('이메일 버튼 클릭 시 /email-login으로 이동', () => {
    render(<Login />);
    fireEvent.click(screen.getByText('이메일로 시작하기'));
    expect(mockPush).toHaveBeenCalledWith('/email-login');
  });

  it('로그인 없이 둘러보기 클릭 시 /home으로 이동', () => {
    render(<Login />);
    fireEvent.click(screen.getByText('로그인 없이 둘러보기'));
    expect(mockPush).toHaveBeenCalledWith('/home');
  });
});
