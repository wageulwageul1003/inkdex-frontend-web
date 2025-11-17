import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva('', {
  variants: {
    variant: {
      default:
        'bg-white text-gray-500 w-fit border border-gray-400 rounded-[12px]',
      contained:
        'bg-black text-white pressed:bg-gray-10 disabled:bg-gray-04 disabled:text-white',
      outline:
        'border border-gray-03 text-gray-08 disabled:bg-gray-01 disabled:text-gray-04 bg-white',
      textOnly: 'text-gray-08 disabled:text-gray-04',
      buttonText:
        'border-b border-gray-08 disabled:border-gray-04 text-gray-08 disabled:text-gray-04',
      // button-icon
      buttonIconContained: 'bg-gray-09',
      buttonIconTextOnly: 'rounded-xl hover:bg-gray-09',
    },
    size: {
      default: '',
      lg: 'h-12 px-4 font-m-2 rounded-lg',
      md: 'h-9 px-4 font-m-2 rounded-lg',
      sm: 'h-7 px-2 font-s-2 rounded-md',
      buttonText: 'w-fit h-fit',
      buttonIconLarge: 'h-12 w-12 flex items-center justify-center',
      buttonIconMedium: 'h-9 w-9 flex items-center justify-center',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
