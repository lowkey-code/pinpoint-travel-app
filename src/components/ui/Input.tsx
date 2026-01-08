import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

function getAriaDescribedBy({
  showError,
  errorMessage,
  helperText,
  inputId,
}: {
  showError: boolean;
  errorMessage?: string;
  helperText?: string;
  inputId: string;
}): string | undefined {
  if (showError && errorMessage) {
    return `${inputId}-error`;
  }
  if (helperText) {
    return `${inputId}-helper`;
  }
  return undefined;
}

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size of the input */
  size?: InputSize;
  /** Error state */
  hasError?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Icon to display on the left */
  leftIcon?: ReactNode;
  /** Icon to display on the right */
  rightIcon?: ReactNode;
  /** Full width input */
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-4 py-4 text-lg',
};

const iconPaddingStyles: Record<InputSize, { left: string; right: string }> = {
  sm: { left: 'pl-9', right: 'pr-9' },
  md: { left: 'pl-11', right: 'pr-11' },
  lg: { left: 'pl-12', right: 'pr-12' },
};

const iconSizeStyles: Record<InputSize, string> = {
  sm: '[&_svg]:w-4 [&_svg]:h-4',
  md: '[&_svg]:w-5 [&_svg]:h-5',
  lg: '[&_svg]:w-6 [&_svg]:h-6',
};

/**
 * Input component with label, helper text, and error handling.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      hasError = false,
      errorMessage,
      label,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const showError = hasError || !!errorMessage;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium font-body text-neutral-700',
              disabled && 'text-neutral-400'
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                'text-neutral-400',
                iconSizeStyles[size],
                disabled && 'text-neutral-300'
              )}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full',
              'bg-white',
              'border rounded-base',
              'font-body',
              'placeholder:text-neutral-400',
              'transition-colors duration-200',
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Size styles
              sizeStyles[size],
              // Icon padding
              leftIcon ? iconPaddingStyles[size].left : undefined,
              rightIcon ? iconPaddingStyles[size].right : undefined,
              // State styles
              showError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200',
              // Disabled styles
              disabled && cn(
                'bg-neutral-50 text-neutral-500',
                'cursor-not-allowed'
              ),
              // Custom className
              className
            )}
            aria-invalid={showError}
            aria-describedby={getAriaDescribedBy({
              showError,
              errorMessage,
              helperText,
              inputId,
            })}
            {...props}
          />

          {rightIcon && (
            <span
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'text-neutral-400',
                iconSizeStyles[size],
                disabled && 'text-neutral-300'
              )}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {showError && errorMessage && (
          <span
            id={`${inputId}-error`}
            className="text-xs font-body text-red-600"
            role="alert"
          >
            {errorMessage}
          </span>
        )}

        {!showError && helperText && (
          <span
            id={`${inputId}-helper`}
            className="text-xs font-body text-neutral-500"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
