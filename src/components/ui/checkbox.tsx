import { FC, InputHTMLAttributes, useState, useEffect } from 'react';

import { Icons } from '@/components/shared/icons';
import { cn } from '@/lib/utils';
type TProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label?: string;
  checkboxStyle?: string;
  labelStyle?: string;
};

const Checkbox: FC<TProps> = (props) => {
  const {
    className,
    label,
    checkboxStyle,
    labelStyle,
    checked,
    onChange,
    ...rest
  } = props;
  const [isChecked, setIsChecked] = useState(checked || false);

  // Update internal state when checked prop changes
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(e);
    }
  };

  const handleClick = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);

    // Create a synthetic event to pass to onChange
    if (onChange) {
      const syntheticEvent = {
        target: { checked: newChecked },
        currentTarget: { checked: newChecked },
        preventDefault: () => {},
        stopPropagation: () => {},
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <fieldset className={cn('flex items-center space-x-2', className)}>
      <div className="relative">
        <input
          type="checkbox"
          id={label}
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
          name={label}
          {...rest}
        />
        <div
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-gray-300"
          onClick={handleClick}
        >
          <div className="h-4 w-4">
            {isChecked ? (
              <Icons.checkOn className="size-5 fill-black stroke-white" />
            ) : (
              <Icons.checkOff className="size-5 fill-white stroke-gray-400" />
            )}
          </div>
        </div>
      </div>
      <label
        htmlFor={label}
        className={cn(
          !label && 'hidden',
          'whitespace-wrap cursor-pointer',
          labelStyle,
        )}
      >
        {label}
      </label>
    </fieldset>
  );
};

export default Checkbox;
