// src/components/core/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-light-accent text-white hover:bg-opacity-90 dark:bg-dark-accent dark:hover:bg-opacity-90 focus-visible:ring-light-accent',
        secondary: 'bg-light-surface text-light-text-primary border border-light-border hover:bg-light-bg dark:bg-dark-surface dark:text-dark-text-primary dark:border-dark-border dark:hover:bg-dark-bg focus-visible:ring-light-accent',
        ghost: 'hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 text-light-accent dark:text-dark-accent',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={twMerge(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export default Button;
