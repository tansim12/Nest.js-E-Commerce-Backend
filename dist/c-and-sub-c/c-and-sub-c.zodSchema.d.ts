import { z } from 'zod';
export declare const categoryAndSubCategorySchema: {
    createCategorySchema: z.ZodObject<{
        body: z.ZodObject<{
            categoryName: z.ZodString;
            isDelete: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isDelete?: boolean;
            categoryName?: string;
        }, {
            isDelete?: boolean;
            categoryName?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            isDelete?: boolean;
            categoryName?: string;
        };
    }, {
        body?: {
            isDelete?: boolean;
            categoryName?: string;
        };
    }>;
    createSubCategorySchema: z.ZodObject<{
        body: z.ZodObject<{
            categoryId: z.ZodString;
            categoryName: z.ZodString;
            isDelete: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isDelete?: boolean;
            categoryId?: string;
            categoryName?: string;
        }, {
            isDelete?: boolean;
            categoryId?: string;
            categoryName?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            isDelete?: boolean;
            categoryId?: string;
            categoryName?: string;
        };
    }, {
        body?: {
            isDelete?: boolean;
            categoryId?: string;
            categoryName?: string;
        };
    }>;
    updateCategorySchema: z.ZodObject<{
        body: z.ZodObject<{
            categoryName: z.ZodOptional<z.ZodString>;
            isDelete: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isDelete?: boolean;
            categoryName?: string;
        }, {
            isDelete?: boolean;
            categoryName?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            isDelete?: boolean;
            categoryName?: string;
        };
    }, {
        body?: {
            isDelete?: boolean;
            categoryName?: string;
        };
    }>;
    updateSubCategorySchema: z.ZodObject<{
        body: z.ZodObject<{
            categoryName: z.ZodString;
            isDelete: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isDelete?: boolean;
            categoryName?: string;
        }, {
            isDelete?: boolean;
            categoryName?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            isDelete?: boolean;
            categoryName?: string;
        };
    }, {
        body?: {
            isDelete?: boolean;
            categoryName?: string;
        };
    }>;
};
