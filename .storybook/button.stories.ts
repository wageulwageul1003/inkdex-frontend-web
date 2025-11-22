import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
    },
    disabled: { control: { type: 'boolean' } },
    asChild: { control: { type: 'boolean' } },
  },
};

export default meta;

// Story 타입 정의
type Story = StoryObj<typeof meta>;

// 최소 하나 이상의 story export 필요
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const TextOnly: Story = {
  args: {
    variant: 'textOnly',
    children: 'Text Only Button',
  },
};

export const ButtonText: Story = {
  args: {
    variant: 'buttonText',
    children: 'Button Text',
  },
};
