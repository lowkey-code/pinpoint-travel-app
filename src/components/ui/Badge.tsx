import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeCategory =
  | 'monument'
  | 'museum'
  | 'restaurant'
  | 'temple'
  | 'hotel'
  | 'shopping'
  | 'other';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Category determines the color scheme */
  category?: BadgeCategory;
  /** Size of the badge */
  size?: BadgeSize;
  /** Badge content */
  children: ReactNode;
}

const categoryStyles: Record<BadgeCategory, string> = {
  monument: 'bg-primary-100 text-primary-800',
  museum: 'bg-indigo-100 text-indigo-800',
  restaurant: 'bg-accent-100 text-accent-800',
  temple: 'bg-pink-100 text-pink-800',
  hotel: 'bg-cyan-100 text-cyan-800',
  shopping: 'bg-purple-100 text-purple-800',
  other: 'bg-neutral-100 text-neutral-700',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

/**
 * Badge component for displaying categories and labels.
 * Built on Ark UI with Tailwind styling.
 * Color scheme is determined by the category prop.
 */
export function Badge({
  category = 'other',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center',
        'font-medium font-body',
        'rounded-full',
        'whitespace-nowrap',
        // Category styles
        categoryStyles[category],
        // Size styles
        sizeStyles[size],
        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
