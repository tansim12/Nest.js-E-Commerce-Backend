import { z } from 'zod';

const createShopFollowSchema = z.object({
  body: z.object({
    shopId: z.string({ required_error: 'Shop Id required' }),
    isDelete: z.boolean({ required_error: 'isDelete required' }),
  }),
});
const createShopReviewSchema = z.object({
  body: z.object({
    shopId: z.string({ required_error: 'Shop Id required' }),
    isDelete: z.boolean({ required_error: 'isDelete required' }),
    details: z.string({ required_error: 'Details required' }),
    rating: z
      .number({ required_error: 'Number required' })
      .min(0)
      .max(5)
      .optional(),
  }),
});

const shopCreateSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required!',
    }),
    contactNumber: z
      .string({
        required_error: 'contactNumber is required!',
      })
      .optional(),
    address: z
      .string({
        required_error: 'address is required!',
      })
      .optional(),
    shopType: z
      .string({
        required_error: 'shopType is required!',
      })
      .optional(),
    description: z
      .string({
        required_error: 'description is required!',
      })
      .optional(),
    vendorId: z.string({
      required_error: 'vendorId is required!',
    }),
  }),
});
const shopUpdateSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required!',
      })
      .optional(),
    contactNumber: z
      .string({
        required_error: 'contactNumber is required!',
      })
      .optional(),
    address: z
      .string({
        required_error: 'address is required!',
      })
      .optional(),
    shopType: z
      .string({
        required_error: 'shopType is required!',
      })
      .optional(),
    description: z
      .string({
        required_error: 'description is required!',
      })
      .optional(),
    vendorId: z
      .string({
        required_error: 'vendorId is required!',
      })
      .optional(),
  }),
});

export const shopFollowSchema = {
  createShopFollowSchema,
  createShopReviewSchema,
  shopCreateSchema,
  shopUpdateSchema,
};
