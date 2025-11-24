import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';

import { Input, type InputProps } from '@/components/ui/input';

const meta: Meta<typeof Input> = {
  title: 'UI Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search'],
    },
    isVerified: {
      control: 'boolean',
    },
    expire: {
      control: 'number',
    },
    error: {
      control: 'object',
      description: 'react-hook-form FieldError 객체',
    },
    className: {
      control: 'text',
    },
  },
  args: {
    type: 'text',
    placeholder: '텍스트를 입력하세요',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: InputProps) => (
    <div className="w-[360px]">
      <Input {...args} />
    </div>
  ),
};

export const Password: Story = {
  render: (args: InputProps) => (
    <div className="w-[360px]">
      <Input {...args} />
    </div>
  ),
  args: {
    type: 'password',
    placeholder: '비밀번호',
  },
};

export const WithTimer: Story = {
  render: (args: InputProps) => (
    <div className="w-[360px]">
      <Input {...args} />
    </div>
  ),
  args: {
    placeholder: '인증 코드를 입력하세요',
    expire: 180,
  },
};

export const Verified: Story = {
  render: (args: InputProps) => (
    <div className="w-[360px]">
      <Input {...args} />
    </div>
  ),
  args: {
    placeholder: '인증 완료 상태',
    isVerified: true,
  },
};
