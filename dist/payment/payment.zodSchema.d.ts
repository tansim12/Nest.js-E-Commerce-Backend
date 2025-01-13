import { z } from 'zod';
export declare const paymentZodValidation: {
    paymentZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, number>;
        }, "strip", z.ZodTypeAny, {
            amount?: number;
        }, {
            amount?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            amount?: number;
        };
    }, {
        body?: {
            amount?: number;
        };
    }>;
    updatePaymentZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            isDecline: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isDecline?: boolean;
        }, {
            isDecline?: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            isDecline?: boolean;
        };
    }, {
        body?: {
            isDecline?: boolean;
        };
    }>;
};
