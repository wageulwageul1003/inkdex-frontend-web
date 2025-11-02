import { FC, InputHTMLAttributes, useState, useEffect } from 'react';

import { Icons } from '@/components/shared/icons';
import { cn } from '@/lib/utils';
type TProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label?: string | React.ReactNode;
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
    disabled,
    id,
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
          id={id}
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
          {...rest}
        />
        <div onClick={handleClick}>
          {isChecked ? (
            <Icons.checkBox
              className={cn('size-6 fill-gray-08', disabled && 'fill-gray-04')}
            />
          ) : (
            <Icons.checkBoxOutlineBlank
              className={cn(
                'size-6 stroke-gray-05',
                disabled && 'stroke-gray-04',
              )}
            />
          )}
        </div>
      </div>
      <label
        htmlFor={id}
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
