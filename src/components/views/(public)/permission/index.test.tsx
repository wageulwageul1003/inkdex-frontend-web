import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';
import Cookies from 'js-cookie';

import Permission from './index';

import { PERMISSION_SHOWN } from '@/constants/tokens';

// useRouter mock
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// js-cookie mock
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

// Icons mock
jest.mock('@/components/shared/icons', () => ({
  Icons: {
    bell: (props: any) => <svg data-testid="bell-icon" {...props} />,
    camera: (props: any) => <svg data-testid="camera-icon" {...props} />,
    photo: (props: any) => <svg data-testid="photo-icon" {...props} />,
    ellipse: (props: any) => <svg data-testid="ellipse-icon" {...props} />,
  },
}));

// Button mock
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('Permission 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('쿠키가 없으면 다이얼로그가 열린다', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    render(<Permission />);

    expect(screen.getByText('앱 접근 권한 안내')).toBeInTheDocument();
    expect(screen.getByText('알림')).toBeInTheDocument();
    expect(screen.getByText('카메라')).toBeInTheDocument();
    expect(screen.getByText('사진')).toBeInTheDocument();
  });

  it('쿠키가 있으면 /login으로 이동', () => {
    (Cookies.get as jest.Mock).mockReturnValue('true');
    render(<Permission />);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('확인 버튼 클릭 시 쿠키를 저장하고 /login으로 이동', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    render(<Permission />);

    const confirmButton = screen.getByText('확인');
    fireEvent.click(confirmButton);

    expect(Cookies.set).toHaveBeenCalledWith(PERMISSION_SHOWN, 'true');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('아이콘들이 렌더링된다', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    render(<Permission />);

    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
    expect(screen.getByTestId('photo-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('ellipse-icon').length).toBeGreaterThan(0);
  });
});
