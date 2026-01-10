import type { BadgeCategory } from '@/components/ui';

export interface Attraction {
  id: string;
  name: string;
  address: string;
  /**
   * Optional: users can save attractions without coordinates, so consumers must handle fallbacks.
   */
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  category: BadgeCategory;
  notes?: string;
  visited?: boolean;
}
