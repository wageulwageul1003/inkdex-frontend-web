import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

/**
 * Button 컴포넌트는 다양한 스타일과 크기를 지원하는 재사용 가능한 버튼입니다.
 *
 * ## 주요 기능:
 * - 여러 variant (default, contained, outline, textOnly, buttonText)
 * - 다양한 size (lg, md, sm, buttonText, buttonIconLarge, buttonIconMedium)
 * - disabled 상태 지원
 * - asChild prop으로 다른 컴포넌트로 렌더링 가능
 */
const meta: Meta<typeof Button> = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'contained',
        'outline',
        'textOnly',
        'buttonText',
        'buttonIconContained',
        'buttonIconTextOnly',
      ],
      description: '버튼의 시각적 스타일을 결정합니다.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'select' },
      options: [
        'default',
        'lg',
        'md',
        'sm',
        'buttonText',
        'buttonIconLarge',
        'buttonIconMedium',
      ],
      description: '버튼의 크기를 결정합니다.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '버튼을 비활성화 상태로 만듭니다.',
    },
    asChild: {
      control: { type: 'boolean' },
      description: '다른 컴포넌트로 렌더링할 때 사용합니다.',
    },
    children: {
      control: { type: 'text' },
      description: '버튼 내부에 표시될 텍스트나 요소입니다.',
    },
  },
  args: {
    children: '버튼',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 버튼',
  },
};

export const Varaints: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="contained" size="lg">
        contained
      </Button>
      <Button variant="outline" size="lg">
        outline
      </Button>
      <Button variant="textOnly" size="lg">
        textOnly
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="contained" size="lg">
        lg
      </Button>
      <Button variant="contained" size="md">
        md
      </Button>
      <Button variant="contained" size="sm">
        sm
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-3">
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <span>outline</span>
          <Icons.dehaze className="size-6 fill-gray-08" />
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Icons.dehaze className="size-6 fill-gray-08" />
          <span>outline</span>
        </Button>
      </div>
    );
  },
};

export const ButtonIcon: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="buttonIconContained" size="buttonIconLarge">
            <Icons.dehaze className="size-6 fill-white" />
          </Button>
          <Button variant="buttonIconOutline" size="buttonIconLarge">
            <Icons.dehaze className="size-6 fill-gray-08" />
          </Button>
          <Button variant="buttonIconTextOnly" size="buttonIconLarge">
            <Icons.dehaze className="size-6 fill-gray-08" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="buttonIconContained" size="buttonIconMedium">
            <Icons.dehaze className="size-6 fill-white" />
          </Button>
          <Button variant="buttonIconOutline" size="buttonIconMedium">
            <Icons.dehaze className="size-6 fill-gray-08" />
          </Button>
          <Button variant="buttonIconTextOnly" size="buttonIconMedium">
            <Icons.dehaze className="size-6 fill-gray-08" />
          </Button>
        </div>
      </div>
    );
  },
};

export const ButtonText: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="buttonText" size="buttonText">
          buttonText
        </Button>
      </div>
    );
  },
};
