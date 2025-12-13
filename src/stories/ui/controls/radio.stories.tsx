import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const RadioGroupDemo = ({
  options,
  defaultValue,
  disabled,
  className,
  ...props
}: {
  options: Array<{
    value: string;
    label: string;
    id?: string;
    disabled?: boolean;
    labelClassName?: string;
  }>;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}) => {
  const [value, setValue] = useState(defaultValue || options[0]?.value || '');

  return (
    <RadioGroup
      onValueChange={setValue}
      value={value}
      className={cn(className)}
      disabled={disabled}
      {...props}
    >
      <div className="flex flex-col space-y-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.id ?? option.value}
              disabled={option.disabled || disabled}
            />
            <label
              htmlFor={option.id ?? option.value}
              className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                option.labelClassName,
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

const meta: Meta<typeof RadioGroupDemo> = {
  title: 'UI Components/Controls/Radio',
  component: RadioGroupDemo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    options: {
      control: 'object',
    },
    defaultValue: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
  },
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    defaultValue: 'option1',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BasicOptions: Story = {
  render: () => (
    <RadioGroupDemo
      options={[
        { value: 'option1', label: '옵션 1' },
        { value: 'option2', label: '옵션 2' },
        { value: 'option3', label: '옵션 3' },
      ]}
      defaultValue="option1"
    />
  ),
};

export const DisabledOptions: Story = {
  render: () => (
    <RadioGroupDemo
      options={[
        { value: 'available', label: 'available' },
        { value: 'disabled1', label: 'disabled1', disabled: true },
        { value: 'disabled2', label: 'disabled2', disabled: true },
        { value: 'available2', label: 'available2' },
      ]}
      defaultValue="available"
    />
  ),
};
