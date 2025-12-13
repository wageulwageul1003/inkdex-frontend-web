import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'contained',
        'outline',
        'textOnly',
        'buttonText',
        'buttonIconContained',
        'buttonIconOutline',
        'buttonIconTextOnly',
      ],
    },
    size: {
      control: 'select',
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
    children: {
      control: 'text',
    },
    // 숨기고 싶은 props
    asChild: {
      table: { disable: true },
    },
    disabled: {
      table: { disable: true },
    },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
