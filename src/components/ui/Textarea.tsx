import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

function getAriaDescribedBy({
  showError,
  errorMessage,
  helperText,
  textareaId,
}: {
  showError: boolean;
  errorMessage?: string;
  helperText?: string;
  textareaId: string;
}): string | undefined {
  if (showError && errorMessage) {
    return `${textareaId}-error`;
  }
  if (helperText) {
    return `${textareaId}-helper`;
  }
  return undefined;
}

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Size of the textarea */
  size?: TextareaSize;
  /** Error state */
  hasError?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Full width textarea */
  fullWidth?: boolean;
  /** Enable auto-resize based on content */
  autoResize?: boolean;
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[80px]',
  md: 'px-4 py-3 text-base min-h-[120px]',
  lg: 'px-4 py-4 text-lg min-h-[160px]',
};

/**
 * Textarea component with label, helper text, and error handling.
 * Built on Ark UI with Tailwind styling.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      hasError = false,
      errorMessage,
      label,
      helperText,
      fullWidth = false,
      autoResize = false,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const showError = hasError || !!errorMessage;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'text-sm font-medium font-body text-neutral-700',
              disabled && 'text-neutral-400'
            )}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={cn(
            // Base styles
            'w-full',
            'bg-white',
            'border rounded-base',
            'font-body',
            'placeholder:text-neutral-400',
            'transition-colors duration-200',
            'resize-y',
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            // Size styles
            sizeStyles[size],
            // Auto-resize
            autoResize && 'resize-none overflow-hidden',
            // State styles
            showError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200',
            // Disabled styles
            disabled && cn(
              'bg-neutral-50 text-neutral-500',
              'cursor-not-allowed resize-none'
            ),
            // Custom className
            className
          )}
          aria-invalid={showError}
          aria-describedby={getAriaDescribedBy({
            showError,
            errorMessage,
            helperText,
            textareaId,
          })}
          {...props}
        />

        {showError && errorMessage && (
          <span
            id={`${textareaId}-error`}
            className="text-xs font-body text-red-600"
            role="alert"
          >
            {errorMessage}
          </span>
        )}

        {!showError && helperText && (
          <span
            id={`${textareaId}-helper`}
            className="text-xs font-body text-neutral-500"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
