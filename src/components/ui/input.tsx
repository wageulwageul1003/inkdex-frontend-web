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
            'font-m-2 placeholder:font-m-2 flex h-12 w-full items-center justify-between rounded-lg border border-gray-03 bg-white px-4 placeholder-gray-05 hover:border-sand-05 focus:border-sand-05 focus-visible:outline-none',
            'file:border-0 file:bg-transparent autofill:shadow-[inset_0_0_0_1000px_var(--white)] disabled:cursor-not-allowed disabled:border-sand-03 disabled:bg-gray-02 disabled:text-gray-08',
            '[&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
            error && 'border-red-05',
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
            className="absolute right-3 top-2/3 -translate-y-3/4"
          >
            {/* {showPassword ? (
              <Icons.visibility className="h-m w-m shrink-0 fill-gray-500" />
            ) : (
              <Icons.visibility_off className="h-m w-m shrink-0 fill-gray-500" />
            )} */}
          </button>
        )}

        {/* Code success and timer */}
        <p className="absolute right-3 top-1/2 -translate-y-1/2">
          {isVerified ? (
            <Icons.check className="h-m w-m fill-green-700" />
          ) : (
            expire && <Timer expire={expire} />
          )}
        </p>
      </fieldset>
    );
  },
);

Input.displayName = 'Input';

export { Input };
