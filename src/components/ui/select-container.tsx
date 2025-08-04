import * as React from 'react';
import { FieldError } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SelectProps {
  options: {
    label: string;
    value: string | boolean;
    disabled?: boolean;
    labelClassName?: string;
  }[];
  onValueChange: (value: string) => void;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  noDataMessage?: string;
  error?: FieldError;
}

export const SelectComponent: React.FC<SelectProps> = ({
  options,
  onValueChange,
  defaultValue = '',
  value,
  placeholder = 'Select an option',
  disabled = false,
  searchable = false,
  className,
  noDataMessage = '항목이 없습니다.',
  error,
}) => {
  // State for search input and debounce
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  // Debounce effect (0.5 seconds)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter options based on the search term
  const filteredOptions = React.useMemo(() => {
    return (
      options &&
      options?.filter(
        (option) =>
          option.label &&
          option.label?.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    );
  }, [debouncedSearch, options]);

  // Use value prop if provided, otherwise fall back to defaultValue
  const selectValue = value !== undefined ? value : defaultValue;

  return (
    <Select
      disabled={disabled}
      onValueChange={onValueChange}
      value={selectValue}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={cn('font-body1', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredOptions &&
          filteredOptions?.length > 0 &&
          filteredOptions.map((option, index) => (
            <SelectItem
              key={`option-${index}`}
              value={String(option.value)}
              disabled={option.disabled}
              className={cn('mx-auto', option?.labelClassName)}
            >
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
