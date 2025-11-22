import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';

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
    docs: {
      description: {
        component:
          '프로젝트에서 사용되는 기본 버튼 컴포넌트입니다. Radix UI와 class-variance-authority를 기반으로 구축되었습니다.',
      },
    },
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

/**
 * 기본 버튼 스타일입니다.
 * 흰색 배경에 회색 테두리와 회색 텍스트를 가집니다.
 */
export const Default: Story = {
  args: {
    children: '기본 버튼',
  },
};

/**
 * 강조된 버튼 스타일입니다.
 * 검은색 배경에 흰색 텍스트를 가집니다.
 */
export const Contained: Story = {
  args: {
    variant: 'contained',
    children: '강조 버튼',
  },
};

/**
 * 아웃라인 버튼 스타일입니다.
 * 흰색 배경에 회색 테두리를 가집니다.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '아웃라인 버튼',
  },
};

/**
 * 텍스트만 있는 버튼 스타일입니다.
 * 배경이나 테두리 없이 텍스트만 표시됩니다.
 */
export const TextOnly: Story = {
  args: {
    variant: 'textOnly',
    children: '텍스트 버튼',
  },
};

/**
 * 밑줄이 있는 텍스트 버튼 스타일입니다.
 * 텍스트 아래에 밑줄이 표시됩니다.
 */
export const ButtonText: Story = {
  args: {
    variant: 'buttonText',
    children: '밑줄 텍스트 버튼',
  },
};

/**
 * 아이콘용 강조 버튼 스타일입니다.
 * 아이콘을 넣기 위한 정사각형 버튼입니다.
 */
export const ButtonIconContained: Story = {
  args: {
    variant: 'buttonIconContained',
    size: 'buttonIconMedium',
    children: '🔍',
  },
};

/**
 * 아이콘용 텍스트 버튼 스타일입니다.
 * 호버 시 배경색이 변경됩니다.
 */
export const ButtonIconTextOnly: Story = {
  args: {
    variant: 'buttonIconTextOnly',
    size: 'buttonIconMedium',
    children: '⚙️',
  },
};

/**
 * 큰 크기의 버튼입니다.
 * 높이 48px, 패딩 16px을 가집니다.
 */
export const Large: Story = {
  args: {
    variant: 'contained',
    size: 'lg',
    children: '큰 버튼',
  },
};

/**
 * 중간 크기의 버튼입니다.
 * 높이 36px, 패딩 16px을 가집니다.
 */
export const Medium: Story = {
  args: {
    variant: 'contained',
    size: 'md',
    children: '중간 버튼',
  },
};

/**
 * 작은 크기의 버튼입니다.
 * 높이 28px, 패딩 8px을 가집니다.
 */
export const Small: Story = {
  args: {
    variant: 'contained',
    size: 'sm',
    children: '작은 버튼',
  },
};

/**
 * 비활성화된 버튼입니다.
 * 클릭할 수 없고 회색으로 표시됩니다.
 */
export const Disabled: Story = {
  args: {
    variant: 'contained',
    disabled: true,
    children: '비활성화된 버튼',
  },
};

/**
 * 다양한 버튼 스타일을 한 번에 보여주는 예시입니다.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">기본</Button>
      <Button variant="contained">강조</Button>
      <Button variant="outline">아웃라인</Button>
      <Button variant="textOnly">텍스트</Button>
      <Button variant="buttonText">밑줄 텍스트</Button>
      <Button variant="buttonIconContained" size="buttonIconMedium">
        🔍
      </Button>
      <Button variant="buttonIconTextOnly" size="buttonIconMedium">
        ⚙️
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 버튼 variant를 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

/**
 * 다양한 버튼 크기를 한 번에 보여주는 예시입니다.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="contained" size="lg">
        큰 버튼
      </Button>
      <Button variant="contained" size="md">
        중간 버튼
      </Button>
      <Button variant="contained" size="sm">
        작은 버튼
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 버튼 크기를 한 번에 확인할 수 있습니다.',
      },
    },
  },
};
