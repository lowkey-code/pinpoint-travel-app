import type { BadgeCategory } from '@/components/ui';

export interface Attraction {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  category: BadgeCategory;
  notes?: string;
}
