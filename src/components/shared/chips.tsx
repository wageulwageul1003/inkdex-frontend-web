'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { TOptionList } from './form-fields';

interface ChipsProps {
  items: TOptionList;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: 'single' | 'multiple';
  disabledItems?: string[];
  className?: string;
  size: 'sm' | 'md';
}

const Chips = React.forwardRef<HTMLDivElement, ChipsProps>(
  (
    {
      items,
      value,
      onValueChange,
      variant = 'single',
      disabledItems = [],
      size = 'md',
      className,
    },
    ref,
  ) => {
    const isSelected = (item: string) => {
      if (variant === 'single') {
        return value === item;
      }

      return Array.isArray(value) && value.includes(item);
    };

    const handleClick = (item: string) => {
      if (!onValueChange) return;

      if (variant === 'single') {
        onValueChange(item);
        return;
      }

      const current = Array.isArray(value) ? value : [];

      if (current.includes(item)) {
        onValueChange(current.filter((v) => v !== item));
      } else {
        onValueChange([...current, item]);
      }
    };

    return (
      <div ref={ref} className={cn('flex flex-wrap gap-2', className)}>
        {items.map((item) => {
          const selected = isSelected(String(item.value));
          const disabled = disabledItems.includes(String(item.value));

          let buttonStyles = '';
          let textStyles = '';

          if (size === 'md') {
            if (disabled) {
              buttonStyles = 'cursor-not-allowed';
            } else if (selected) {
              buttonStyles = 'bg-gray-09';
              textStyles = 'text-white';
            } else {
              buttonStyles = 'bg-gray-01';
              textStyles = 'text-gray-08';
            }
          } else {
            if (disabled) {
              buttonStyles = 'cursor-not-allowed';
            } else if (selected) {
              buttonStyles = 'bg-sand-01';
              textStyles = 'text-sand-08';
            } else {
              buttonStyles = 'bg-white';
              textStyles = 'text-gray-05';
            }
          }

          return (
            <button
              key={String(item.value)}
              type="button"
              disabled={disabled}
              onClick={() => handleClick(String(item.value))}
              className={cn(
                'flex min-w-[65px] flex-shrink-0 items-center justify-center whitespace-nowrap rounded-full transition-all',
                buttonStyles,
                size === 'md' ? 'px-3 py-2' : 'px-2 py-1.5',
              )}
            >
              <span
                className={cn(
                  textStyles,
                  size === 'md' ? 'font-s-2' : 'font-xs-2',
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);

Chips.displayName = 'Chips';

export default Chips;
