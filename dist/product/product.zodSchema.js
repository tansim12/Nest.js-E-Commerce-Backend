"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        productName: zod_1.z.string().min(1, 'Product name is required'),
        quantity: zod_1.z.number().int().min(0).default(1).optional(),
        isAvailable: zod_1.z.boolean().default(true).optional(),
        totalBuy: zod_1.z.number().int().min(0).default(0).optional(),
        price: zod_1.z.number().int().positive('Price must be a positive integer'),
        discount: zod_1.z.number().int().min(0).nullable().optional(),
        promo: zod_1.z.string().nullable().optional(),
        isActivePromo: zod_1.z.boolean().default(false).optional(),
        isFlashSaleOffer: zod_1.z.boolean().default(false).optional(),
        flashSaleDiscount: zod_1.z.number().int().min(0).default(0).nullable().optional(),
        flashSaleStartDate: zod_1.z.string().nullable().optional(),
        flashSaleEndDate: zod_1.z.string().nullable().optional(),
        description: zod_1.z.string().min(1, 'Description is required'),
        totalSubmitRating: zod_1.z.number().int().min(0).default(0).optional(),
        averageRating: zod_1.z.number().int().min(0).default(0).optional(),
        images: zod_1.z
            .array(zod_1.z.string().url(), {
            required_error: 'At least one image is required',
        })
            .nonempty(),
        categoryId: zod_1.z.string(),
        subCategoryId: zod_1.z.string().nullable().optional(),
        isDelete: zod_1.z.boolean().default(false).optional(),
    }),
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        productName: zod_1.z.string().min(1, 'Product name is required').optional(),
        quantity: zod_1.z.number().int().min(0).default(1).optional(),
        isAvailable: zod_1.z.boolean().default(true).optional(),
        price: zod_1.z
            .number()
            .int()
            .positive('Price must be a positive integer')
            .optional(),
        discount: zod_1.z.number().int().min(0).nullable().optional(),
        promo: zod_1.z.string().nullable().optional(),
        isActivePromo: zod_1.z.boolean().default(false).optional(),
        isFlashSaleOffer: zod_1.z.boolean().default(false).optional(),
        flashSaleDiscount: zod_1.z.number().int().min(0).default(0).nullable().optional(),
        flashSaleStartDate: zod_1.z.string().nullable().optional(),
        flashSaleEndDate: zod_1.z.string().nullable().optional(),
        description: zod_1.z.string().min(1, 'Description is required').optional(),
        images: zod_1.z
            .array(zod_1.z.string().url(), {
            required_error: 'At least one image is required',
        })
            .nonempty()
            .optional(),
        categoryId: zod_1.z.string().optional(),
        subCategoryId: zod_1.z.string().nullable().optional(),
        isDelete: zod_1.z.boolean().optional(),
    }),
});
exports.productSchema = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
//# sourceMappingURL=product.zodSchema.js.map