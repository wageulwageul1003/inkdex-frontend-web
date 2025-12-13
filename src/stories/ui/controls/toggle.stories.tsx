import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';

import { Switch } from '@/components/ui/switch';

const ToggleDemo = ({
  checked,
  disabled,
  className,
  ...props
}: {
  checked?: boolean;
  disabled?: boolean;
  className?: string;
}) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleCheckedChange = (newChecked: boolean) => {
    setIsChecked(newChecked);
  };

  return (
    <Switch
      className={className}
      disabled={disabled}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      {...props}
    />
  );
};

const meta: Meta<typeof ToggleDemo> = {
  title: 'UI Components/Controls/Toggle',
  component: ToggleDemo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
  },
  args: {
    checked: false,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BasicToggle: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ToggleDemo />
        <span className="font-xxl-1">기본 토글</span>
      </div>
      <div className="flex items-center gap-3">
        <ToggleDemo checked={true} />
        <span className="font-xxl-1">활성화된 토글</span>
      </div>
      <div className="flex items-center gap-3">
        <ToggleDemo disabled={true} />
        <span className="font-xxl-1">비활성화된 토글</span>
      </div>
      <div className="flex items-center gap-3">
        <ToggleDemo checked={true} disabled={true} />
        <span className="font-xxl-1">활성화되고 비활성화된 토글</span>
      </div>
    </div>
  ),
};
