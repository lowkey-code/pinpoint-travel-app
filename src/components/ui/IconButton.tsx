import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type IconButtonVariant = 'default' | 'primary' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Size of the button */
  size?: IconButtonSize;
  /** Accessible label (required for icon-only buttons) */
  'aria-label': string;
  /** Icon element to display */
  children: ReactNode;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: cn(
    'bg-transparent text-neutral-600',
    'hover:bg-neutral-100',
    'active:bg-neutral-200',
    'focus-visible:ring-neutral-200'
  ),
  primary: cn(
    'bg-primary-600 text-white',
    'hover:bg-primary-700',
    'active:bg-primary-800',
    'shadow-primary',
    'focus-visible:ring-primary-200'
  ),
  ghost: cn(
    'bg-transparent text-primary-600',
    'hover:bg-primary-50',
    'active:bg-primary-100',
    'focus-visible:ring-primary-200'
  ),
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8 [&_svg]:w-4 [&_svg]:h-4',
  md: 'w-10 h-10 [&_svg]:w-5 [&_svg]:h-5',
  lg: 'w-12 h-12 [&_svg]:w-6 [&_svg]:h-6',
};

/**
 * Icon-only button component.
 * Built on Ark UI with Tailwind styling.
 * Requires aria-label for accessibility.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'rounded-full',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          // Custom className
          className
        )}
        disabled={disabled}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
