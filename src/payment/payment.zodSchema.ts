import { z } from 'zod';

const paymentZodSchema = z.object({
  body: z.object({
    amount: z.number().refine((val) => typeof val === 'number', {
      message: 'amount must be a number',
    }),
  }),
});
const updatePaymentZodSchema = z.object({
  body: z.object({
    isDecline: z
      .boolean({ required_error: 'Decline should be boolean' })
      .optional(),
  }),
});

export const paymentZodValidation = {
  paymentZodSchema,
  updatePaymentZodSchema,
};
