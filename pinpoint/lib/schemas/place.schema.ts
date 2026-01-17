import { z } from 'zod';
import { CategoryIdSchema } from './category.schema';

/**
 * Main Place Schema
 */
export const PlaceSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'O nome é obrigatório'),
    address: z.string().min(1, 'O endereço é obrigatório'),
    category: CategoryIdSchema,
    note: z.string().optional(),
    createdAt: z.date(),
});

/**
 * Create Place Schema (excludes auto-generated fields)
 */
export const CreatePlaceSchema = PlaceSchema.omit({
    id: true,
    createdAt: true,
});

/**
 * Update Place Schema (partial, excludes protected fields)
 */
export const UpdatePlaceSchema = PlaceSchema.omit({
    id: true,
    createdAt: true,
}).partial();

/**
 * Inferred Types
 */
export type Place = z.infer<typeof PlaceSchema>;
export type CreatePlace = z.infer<typeof CreatePlaceSchema>;
export type UpdatePlace = z.infer<typeof UpdatePlaceSchema>;
