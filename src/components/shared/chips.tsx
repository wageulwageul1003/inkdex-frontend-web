import * as React from 'react';

import { cn } from '@/lib/utils';
import { IConstant } from '@/types/global';

interface ChipsProps {
  items: IConstant[];
  variant?: 'single' | 'multiple'; // 단일 또는 다중 선택 모드
  disabledItems?: string[]; // 비활성화할 항목 배열
  selected?: string | string[]; // 선택된 항목(들)
  onChange?: (item: string | string[]) => void; // 선택 변경 시 호출될 콜백
  type?: 'round' | 'text';
}

const Chips: React.FC<ChipsProps> = ({
  items,
  variant = 'single',
  disabledItems = [],
  selected,
  onChange,
  type = 'round',
}) => {
  // 내부 상태는 외부에서 제어될 때만 사용
  const [internalSelected, setInternalSelected] = React.useState<
    string | string[] | null
  >(variant === 'single' ? null : []);

  // 실제 선택된 값 (외부 또는 내부)
  const selectedValue = selected !== undefined ? selected : internalSelected;

  // 항목 클릭 핸들러
  const handleItemClick = (item: string) => {
    if (variant === 'single') {
      // 단일 선택 모드
      if (onChange) {
        onChange(item);
      } else {
        setInternalSelected(item);
      }
    } else {
      // 다중 선택 모드
      const currentSelected = Array.isArray(selectedValue) ? selectedValue : [];
      let newSelected: string[];

      if (currentSelected.includes(item)) {
        // 이미 선택된 항목이면 제거
        newSelected = currentSelected.filter((i) => i !== item);
      } else {
        // 선택되지 않은 항목이면 추가
        newSelected = [...currentSelected, item];
      }

      if (onChange) {
        onChange(newSelected);
      } else {
        setInternalSelected(newSelected);
      }
    }
  };

  // 항목이 선택되었는지 확인하는 함수
  const isItemSelected = (item: string): boolean => {
    if (variant === 'single') {
      return selectedValue === item;
    } else {
      return Array.isArray(selectedValue) && selectedValue.includes(item);
    }
  };

  return items.map((item, index) => {
    const isSelected = isItemSelected(String(item.value));
    const isDisabled = disabledItems.includes(String(item.value));

    let buttonStyles = '';
    let textStyles = '';

    if (type === 'round') {
      if (isDisabled) {
        buttonStyles = 'border-gray-200 bg-gray-03 cursor-not-allowed border';
        textStyles = 'text-gray-400';
      } else if (isSelected) {
        buttonStyles = 'bg-gray-09';
        textStyles = 'text-white';
      } else {
        buttonStyles = 'bg-gray-03';
        textStyles = 'text-gray-09';
      }
    } else {
      if (isDisabled) {
        buttonStyles = 'cursor-not-allowed';
        textStyles = 'text-gray-400';
      } else if (isSelected) {
        buttonStyles = 'bg-sand-01';
        textStyles = 'text-sand-08';
      } else {
        buttonStyles = 'bg-white';
        textStyles = 'text-gray-05';
      }
    }

    return (
      <button
        key={index}
        className={cn(
          `flex min-w-[65px] flex-shrink-0 items-center justify-center whitespace-nowrap transition-all`,
          type === 'round' ? 'rounded-full px-4 py-3' : 'px-2 py-1.5',
          buttonStyles,
        )}
        onClick={() => {
          if (!isDisabled) handleItemClick(String(item.value));
        }}
        disabled={isDisabled}
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
  });
};

export default Chips;
