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
  type?: 'round' | 'text';
  className?: string;
}

const Chips = React.forwardRef<HTMLDivElement, ChipsProps>(
  (
    {
      items,
      value,
      onValueChange,
      variant = 'single',
      disabledItems = [],
      type = 'round',
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

          if (type === 'round') {
            if (disabled) {
              buttonStyles =
                'border border-gray-200 bg-gray-03 cursor-not-allowed';
              textStyles = 'text-gray-400';
            } else if (selected) {
              buttonStyles = 'bg-gray-09';
              textStyles = 'text-white';
            } else {
              buttonStyles = 'bg-gray-01';
              textStyles = 'text-gray-09';
            }
          } else {
            if (disabled) {
              buttonStyles = 'cursor-not-allowed';
              textStyles = 'text-gray-400';
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
                type === 'round' ? 'px-3 py-2' : 'px-2 py-1.5',
                buttonStyles,
              )}
            >
              <span
                className={cn(
                  textStyles,
                  type === 'round' ? 'font-s-2' : 'font-xs-2',
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
