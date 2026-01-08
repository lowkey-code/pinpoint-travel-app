import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type CardVariant = 'default' | 'outlined' | 'elevated';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant;
  /** Adds hover effect */
  hoverable?: boolean;
  /** Removes padding */
  noPadding?: boolean;
  /** Card content */
  children: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: cn(
    'bg-white',
    'border border-neutral-200',
    'shadow-sm'
  ),
  outlined: cn(
    'bg-white',
    'border border-neutral-300'
  ),
  elevated: cn(
    'bg-white',
    'border border-neutral-100',
    'shadow-md'
  ),
};

/**
 * Card component for grouping related content.
 * Supports header, body, and footer sub-components.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = false,
      noPadding = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-md',
          'overflow-hidden',
          // Variant styles
          variantStyles[variant],
          // Padding
          !noPadding && 'p-4',
          // Hover effect
          hoverable && cn(
            'transition-all duration-200',
            'hover:shadow-md hover:border-primary-200',
            'cursor-pointer'
          ),
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card header section.
 */
export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'pb-3',
        'border-b border-neutral-100',
        'mb-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card body section.
 */
export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn('flex-1', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card footer section.
 */
export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2',
        'pt-3',
        'border-t border-neutral-100',
        'mt-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
