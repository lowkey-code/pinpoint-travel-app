/**
 * Merges class names safely, handling undefined, null, and empty strings
 * Prevents extra whitespace issues when concatenating Tailwind classes
 * @param classes - Variable number of class strings to merge
 * @returns Merged className string without extra whitespace
 */
export function cn(...classes: (string | undefined | null)[]): string {
  return classes
    .filter((cls) => cls && cls.trim() !== '')
    .join(' ');
}
