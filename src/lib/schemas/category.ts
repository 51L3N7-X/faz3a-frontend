import { z } from 'zod';

export const CreateCategorySchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  type: z.enum(['SERVICE', 'JOB']),
  isActive: z.boolean().default(true),
});

export type CreateCategoryFormInput = z.input<typeof CreateCategorySchema>;
export type CreateCategoryFormData = z.output<typeof CreateCategorySchema>;

export const CreateSubCategorySchema = CreateCategorySchema.omit({ type: true });
export type CreateSubCategoryFormInput = z.input<typeof CreateSubCategorySchema>;
export type CreateSubCategoryFormData = z.output<typeof CreateSubCategorySchema>;