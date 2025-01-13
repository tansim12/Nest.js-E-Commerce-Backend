"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryAndSubCategorySchema = void 0;
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        categoryName: zod_1.z.string({ required_error: 'Category name string required' }),
        isDelete: zod_1.z
            .boolean({ required_error: 'isDelete boolean required' })
            .optional(),
    }),
});
const updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        categoryName: zod_1.z
            .string({ required_error: 'Category name string required' })
            .optional(),
        isDelete: zod_1.z
            .boolean({ required_error: 'isDelete boolean required' })
            .optional(),
    }),
});
const createSubCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        categoryId: zod_1.z.string({ required_error: 'CategoryId string required' }),
        categoryName: zod_1.z.string({ required_error: 'Category name string required' }),
        isDelete: zod_1.z
            .boolean({ required_error: 'isDelete boolean required' })
            .optional(),
    }),
});
const updateSubCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        categoryName: zod_1.z.string({ required_error: 'Category name string required' }),
        isDelete: zod_1.z
            .boolean({ required_error: 'isDelete boolean required' })
            .optional(),
    }),
});
exports.categoryAndSubCategorySchema = {
    createCategorySchema,
    createSubCategorySchema,
    updateCategorySchema,
    updateSubCategorySchema,
};
//# sourceMappingURL=c-and-sub-c.zodSchema.js.map