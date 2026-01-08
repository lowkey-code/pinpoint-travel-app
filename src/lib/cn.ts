/**
 * Merges class names safely, handling undefined, null, false, and empty strings
 * Prevents extra whitespace issues when concatenating Tailwind classes
 * Supports conditional classes: cn('base', condition && 'conditional-class')
 * @param classes - Variable number of class strings to merge
 * @returns Merged className string without extra whitespace
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter((cls): cls is string => typeof cls === 'string' && cls.trim() !== '')
    .join(' ');
}
