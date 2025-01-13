"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentZodValidation = void 0;
const zod_1 = require("zod");
const paymentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().refine((val) => typeof val === 'number', {
            message: 'amount must be a number',
        }),
    }),
});
const updatePaymentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        isDecline: zod_1.z
            .boolean({ required_error: 'Decline should be boolean' })
            .optional(),
    }),
});
exports.paymentZodValidation = {
    paymentZodSchema,
    updatePaymentZodSchema,
};
//# sourceMappingURL=payment.zodSchema.js.map