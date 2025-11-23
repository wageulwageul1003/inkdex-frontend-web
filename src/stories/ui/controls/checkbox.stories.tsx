import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';

import Checkbox from '@/components/ui/checkbox';

const CheckboxDemo = ({
  label,
  checked,
  disabled,
  className,
  checkboxStyle,
  labelStyle,
  ...props
}: {
  label?: string | React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  checkboxStyle?: string;
  labelStyle?: string;
}) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <Checkbox
      label={label}
      className={className}
      checkboxStyle={checkboxStyle}
      labelStyle={labelStyle}
      disabled={disabled}
      checked={isChecked}
      onChange={handleChange}
      id={`checkbox-${Math.random().toString(36).substr(2, 9)}`}
      {...props}
    />
  );
};

const meta: Meta<typeof CheckboxDemo> = {
  title: 'UI Components/Controls/Checkbox',
  component: CheckboxDemo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
    checkboxStyle: {
      control: 'text',
    },
    labelStyle: {
      control: 'text',
    },
  },
  args: {
    label: '체크박스 라벨',
    checked: false,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BasicCheckbox: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CheckboxDemo label="기본 체크박스" />
      <CheckboxDemo label="체크된 상태" checked={true} />
      <CheckboxDemo
        label="비활성화된 체크박스"
        checked={true}
        disabled={true}
      />
    </div>
  ),
};
