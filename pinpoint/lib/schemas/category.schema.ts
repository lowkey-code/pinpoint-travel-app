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
    { id: 'food', label: 'Alimentação', icon: '🍜' },
    { id: 'museum', label: 'Museu / Atração', icon: '🏛️' },
    { id: 'viewpoint', label: 'Vista / Mirante', icon: '🌄' },
    { id: 'hotel', label: 'Hospedagem', icon: '🏨' },
    { id: 'shopping', label: 'Compras', icon: '🛍️' },
    { id: 'transport', label: 'Transporte', icon: '🚇' },
    { id: 'other', label: 'Outro', icon: '📍' },
];

/**
 * Literal type for category IDs to be used in PlaceSchema
 */
export const CategoryIdSchema = z.enum([
    'food',
    'museum',
    'viewpoint',
    'hotel',
    'shopping',
    'transport',
    'other',
]);
