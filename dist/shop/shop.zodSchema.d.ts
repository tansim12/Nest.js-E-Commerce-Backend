import { z } from 'zod';
export declare const shopFollowSchema: {
    createShopFollowSchema: z.ZodObject<{
        body: z.ZodObject<{
            shopId: z.ZodString;
            isDelete: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            isDelete?: boolean;
            shopId?: string;
        }, {
            isDelete?: boolean;
            shopId?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            isDelete?: boolean;
            shopId?: string;
        };
    }, {
        body?: {
            isDelete?: boolean;
            shopId?: string;
        };
    }>;
    createShopReviewSchema: z.ZodObject<{
        body: z.ZodObject<{
            shopId: z.ZodString;
            isDelete: z.ZodBoolean;
            details: z.ZodString;
            rating: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            isDelete?: boolean;
            shopId?: string;
            details?: string;
            rating?: number;
        }, {
            isDelete?: boolean;
            shopId?: string;
            details?: string;
            rating?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            isDelete?: boolean;
            shopId?: string;
            details?: string;
            rating?: number;
        };
    }, {
        body?: {
            isDelete?: boolean;
            shopId?: string;
            details?: string;
            rating?: number;
        };
    }>;
    shopCreateSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            contactNumber: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
            shopType: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            vendorId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            contactNumber?: string;
            vendorId?: string;
            description?: string;
            shopType?: string;
            address?: string;
        }, {
            name?: string;
            contactNumber?: string;
            vendorId?: string;
            description?: string;
            shopType?: string;
            address?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            name?: string;
            contactNumber?: string;
            vendorId?: string;
            description?: string;
            shopType?: string;
            address?: string;
        };
    }, {
        body?: {
            name?: string;
            contactNumber?: string;
            vendorId?: string;
            description?: string;
            shopType?: string;
            address?: string;
        };
    }>;
    shopUpdateSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            contactNumber: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
            shopType: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            vendorId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            contactNumber?: string;
            vendorId?: string;
            description?: string;
            shopType?: string;
            address?: string;
        }, {
            name?: string;
            contactNumber?: string;
            vendorId?: string;
            description?: string;
            shopType?: string;
            address?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            name?: string;
            contactNumber?: string;
            vendorId?: string;
            description?: string;
            shopType?: string;
            address?: string;
        };
    }, {
        body?: {
            name?: string;
            contactNumber?: string;
            vendorId?: string;
            description?: string;
            shopType?: string;
            address?: string;
        };
    }>;
};
