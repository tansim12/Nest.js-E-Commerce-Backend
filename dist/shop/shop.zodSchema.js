"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopFollowSchema = void 0;
const zod_1 = require("zod");
const createShopFollowSchema = zod_1.z.object({
    body: zod_1.z.object({
        shopId: zod_1.z.string({ required_error: 'Shop Id required' }),
        isDelete: zod_1.z.boolean({ required_error: 'isDelete required' }),
    }),
});
const createShopReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        shopId: zod_1.z.string({ required_error: 'Shop Id required' }),
        isDelete: zod_1.z.boolean({ required_error: 'isDelete required' }),
        details: zod_1.z.string({ required_error: 'Details required' }),
        rating: zod_1.z
            .number({ required_error: 'Number required' })
            .min(0)
            .max(5)
            .optional(),
    }),
});
const shopCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required!',
        }),
        contactNumber: zod_1.z
            .string({
            required_error: 'contactNumber is required!',
        })
            .optional(),
        address: zod_1.z
            .string({
            required_error: 'address is required!',
        })
            .optional(),
        shopType: zod_1.z
            .string({
            required_error: 'shopType is required!',
        })
            .optional(),
        description: zod_1.z
            .string({
            required_error: 'description is required!',
        })
            .optional(),
        vendorId: zod_1.z.string({
            required_error: 'vendorId is required!',
        }),
    }),
});
const shopUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required!',
        })
            .optional(),
        contactNumber: zod_1.z
            .string({
            required_error: 'contactNumber is required!',
        })
            .optional(),
        address: zod_1.z
            .string({
            required_error: 'address is required!',
        })
            .optional(),
        shopType: zod_1.z
            .string({
            required_error: 'shopType is required!',
        })
            .optional(),
        description: zod_1.z
            .string({
            required_error: 'description is required!',
        })
            .optional(),
        vendorId: zod_1.z
            .string({
            required_error: 'vendorId is required!',
        })
            .optional(),
    }),
});
exports.shopFollowSchema = {
    createShopFollowSchema,
    createShopReviewSchema,
    shopCreateSchema,
    shopUpdateSchema,
};
//# sourceMappingURL=shop.zodSchema.js.map