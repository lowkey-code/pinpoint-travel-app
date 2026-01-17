import { z } from 'zod';

/**
 * Category Schema
 */
export const CategorySchema = z.object({
    id: z.string(),
    label: z.string(),
    icon: z.string(), // Name of the icon (e.g., from Lucide)
});

/**
 * Inferred Category Type
 */
export type Category = z.infer<typeof CategorySchema>;

/**
 * Constant list of categories based on the app's requirements
 */
export const CATEGORIES: Category[] = [
    { id: 'attraction', label: 'Atração', icon: 'MapPin' },
    { id: 'restaurant', label: 'Restaurante', icon: 'Utensils' },
    { id: 'hotel', label: 'Hospedagem', icon: 'Hotel' },
    { id: 'shopping', label: 'Compras', icon: 'ShoppingBag' },
    { id: 'transport', label: 'Transporte', icon: 'Car' },
    { id: 'other', label: 'Outro', icon: 'MoreHorizontal' },
];

/**
 * Literal type for category IDs to be used in PlaceSchema
 */
export const CategoryIdSchema = z.enum([
    'attraction',
    'restaurant',
    'hotel',
    'shopping',
    'transport',
    'other',
]);
