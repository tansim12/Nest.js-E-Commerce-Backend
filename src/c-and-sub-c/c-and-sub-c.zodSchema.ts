import { z } from 'zod';

const createCategorySchema = z.object({
  body: z.object({
    categoryName: z.string({ required_error: 'Category name string required' }),
    isDelete: z
      .boolean({ required_error: 'isDelete boolean required' })
      .optional(),
  }),
});
const updateCategorySchema = z.object({
  body: z.object({
    categoryName: z
      .string({ required_error: 'Category name string required' })
      .optional(),
    isDelete: z
      .boolean({ required_error: 'isDelete boolean required' })
      .optional(),
  }),
});
const createSubCategorySchema = z.object({
  body: z.object({
    categoryId: z.string({ required_error: 'CategoryId string required' }),
    categoryName: z.string({ required_error: 'Category name string required' }),
    isDelete: z
      .boolean({ required_error: 'isDelete boolean required' })
      .optional(),
  }),
});
const updateSubCategorySchema = z.object({
  body: z.object({
    categoryName: z.string({ required_error: 'Category name string required' }),
    isDelete: z
      .boolean({ required_error: 'isDelete boolean required' })
      .optional(),
  }),
});

export const categoryAndSubCategorySchema = {
  createCategorySchema,
  createSubCategorySchema,
  updateCategorySchema,
  updateSubCategorySchema,
};
