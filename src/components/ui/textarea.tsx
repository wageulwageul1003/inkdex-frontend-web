import * as React from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-input placeholder:font-m-2 focus-visible:ring-ring font-m-2 placeholder:font-m-2 flex min-h-[232px] w-full rounded-lg border bg-white px-4 py-3 text-black placeholder:text-gray-05 hover:border-gray-06 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:bg-gray-01',
          error && 'border-red-05',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
