import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import Login from './index';

import Image, { ImageProps } from 'next/image';

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    return <Image {...props} />;
  },
}));

// Mock Icons
jest.mock('@/components/shared/icons', () => ({
  Icons: {
    close: function CloseIcon(props: any) {
      return <svg data-testid="close-icon" {...props} />;
    },
    keyboardArrowRight: function ArrowIcon(props: any) {
      return <svg data-testid="arrow-right-icon" {...props} />;
    },
    email: function EmailIcon(props: any) {
      return <svg data-testid="email-icon" {...props} />;
    },
  },
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: function MockButton({ children, onClick, ...props }: any) {
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  },
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Login 컴포넌트', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('로그인 화면이 정상적으로 렌더링된다', () => {
    render(<Login />);

    // 로고 이미지가 렌더링되는지 확인
    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    // 로그인/회원가입 텍스트가 보이는지 확인
    expect(screen.getByText('로그인/회원가입')).toBeInTheDocument();

    // 각 로그인 방법 버튼들이 렌더링되는지 확인
    expect(screen.getByText('카카오로 시작하기')).toBeInTheDocument();
    expect(screen.getByText('Apple로 시작하기')).toBeInTheDocument();
    expect(screen.getByText('구글로 시작하기')).toBeInTheDocument();
    expect(screen.getByText('이메일로 시작하기')).toBeInTheDocument();

    // 로그인 없이 둘러보기 버튼이 렌더링되는지 확인
    expect(screen.getByText('로그인 없이 둘러보기')).toBeInTheDocument();
  });

  it('닫기 아이콘 클릭 시 /home으로 이동한다', () => {
    render(<Login />);

    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.click(closeIcon);

    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('이메일로 시작하기 버튼 클릭 시 /email-login으로 이동한다', () => {
    render(<Login />);

    const emailButton = screen.getByText('이메일로 시작하기');
    fireEvent.click(emailButton);

    expect(mockPush).toHaveBeenCalledWith('/email-login');
  });

  it('로그인 없이 둘러보기 버튼 클릭 시 /home으로 이동한다', () => {
    render(<Login />);

    const guestButton = screen.getByText('로그인 없이 둘러보기');
    fireEvent.click(guestButton);

    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('소셜 로그인 버튼들이 올바른 스타일로 렌더링된다', () => {
    render(<Login />);

    // 카카오 버튼 확인
    const kakaoButton = screen.getByText('카카오로 시작하기').closest('div');
    expect(kakaoButton).toHaveClass('bg-[#FEE500]');

    // Apple 버튼 확인
    const appleButton = screen.getByText('Apple로 시작하기').closest('div');
    expect(appleButton).toHaveClass('bg-black');

    // 구글 버튼 확인
    const googleButton = screen.getByText('구글로 시작하기').closest('div');
    expect(googleButton).toHaveClass('bg-white');

    // 이메일 버튼 확인
    const emailButton = screen.getByText('이메일로 시작하기').closest('div');
    expect(emailButton).toHaveClass('bg-gray-08');
  });
});
