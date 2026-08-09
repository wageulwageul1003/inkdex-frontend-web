import * as React from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, placeholder, ...props }, ref) => {
    const [value, setValue] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };

    return (
      <div className="relative">
        {value === '' && placeholder && (
          <div className="pointer-events-none absolute left-4 top-3 whitespace-pre-line text-gray-05">
            {placeholder}
          </div>
        )}

        <textarea
          {...props}
          ref={ref}
          value={value}
          onChange={handleChange}
          placeholder=""
          className={cn(
            'border-input font-m-2 flex min-h-[232px] w-full rounded-lg border bg-white px-4 py-3 text-black hover:border-gray-06 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-01',
            error && 'border-red-05',
            className,
          )}
        />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
