/**
 * Ark UI Setup and Configuration
 * Provides global setup for Ark UI components
 */

import type { ReactNode } from 'react';

/**
 * ArkUIProvider - Wrapper component for Ark UI initialization
 * Currently acts as a pass-through, but prepared for future global Ark UI setup
 */
export function ArkUIProvider({ children }: { children: ReactNode }) {
  // Ark UI doesn't require a provider wrapper in the current version,
  // but we keep this component for consistency and future extensibility
  return <>{children}</>;
}
