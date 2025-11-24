'use client';

import * as React from 'react';
import { FieldError } from 'react-hook-form';

import Timer from './timer';

import { Icons } from '@/components/shared/icons';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  isSearchIcon?: boolean;
  isVerified?: boolean;
  expire?: string | number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      error,
      isSearchIcon = false,
      isVerified = false,
      expire,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <fieldset className="relative w-full">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          className={cn(
            'font-m-2 placeholder:font-m-2 flex h-12 w-full items-center justify-between rounded-lg border border-gray-03 bg-white px-4 text-black placeholder-gray-05 hover:border-sand-05 focus:border-gray-06 focus-visible:outline-none',
            'file:border-0 file:bg-transparent autofill:shadow-[inset_0_0_0_1000px_var(--white)] disabled:cursor-not-allowed disabled:border-gray-03 disabled:bg-gray-02 disabled:text-gray-08',
            '[&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
            error && 'border-red-05',
            type === 'password' && 'pr-11',
            className,
          )}
          ref={ref}
          {...props}
        />

        {/* If password type, show toggle visibility icons */}
        {type === 'password' && (
          <button
            type="button"
            aria-label="Toggle password visibility"
            aria-pressed={showPassword}
            title={showPassword ? 'Show password' : 'Hide password'}
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-2/3 -translate-y-3/4"
          >
            {showPassword ? (
              <Icons.visibility className="size-6 shrink-0 fill-gray-05" />
            ) : (
              <Icons.visibilityOff className="size-6 shrink-0 fill-gray-05" />
            )}
          </button>
        )}

        {/* Code success and timer */}
        <div className="absolute inset-y-0 right-4 flex items-center">
          {isVerified ? (
            <Icons.check className="size-5 fill-gray-05" />
          ) : (
            expire && <Timer expire={expire} />
          )}
        </div>
      </fieldset>
    );
  },
);

Input.displayName = 'Input';

export { Input };
