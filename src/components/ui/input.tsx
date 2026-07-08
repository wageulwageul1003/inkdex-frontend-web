'use client';

import * as React from 'react';
import { FieldError } from 'react-hook-form';

import Timer from './timer';

import { Icons } from '@/components/shared/icons';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  isVerified?: boolean;
  expire?: string | number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', error, isVerified = false, expire, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <fieldset className="relative w-full">
        {/* Search Icon */}
        {type === 'search' && (
          <Icons.search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 fill-gray-05" />
        )}

        <input
          ref={ref}
          type={type === 'password' && showPassword ? 'text' : type}
          className={cn(
            'flex w-full rounded-lg border border-gray-03 bg-white text-black placeholder-gray-05 hover:border-sand-05 focus:border-gray-06 focus-visible:outline-none',
            'file:border-0 file:bg-transparent autofill:shadow-[inset_0_0_0_1000px_var(--white)] disabled:cursor-not-allowed disabled:border-gray-03 disabled:bg-gray-02 disabled:text-gray-08',
            '[&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',

            // 기본
            type !== 'search' && 'font-m-2 placeholder:font-m-2 h-12 px-4',

            // Search 스타일
            type === 'search' &&
              'font-s-2 placeholder:font-s-2 h-9 border-none bg-gray-01 px-4 py-2 pl-8',

            error && 'border-red-05',
            type === 'password' && 'pr-11',

            className,
          )}
          {...props}
        />

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            aria-label="Toggle password visibility"
            aria-pressed={showPassword}
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-2/3 -translate-y-3/4"
          >
            {showPassword ? (
              <Icons.visibility className="size-6 fill-gray-05" />
            ) : (
              <Icons.visibilityOff className="size-6 fill-gray-05" />
            )}
          </button>
        )}

        {/* Verify / Timer */}
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
