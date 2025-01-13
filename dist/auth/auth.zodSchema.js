"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchemas = void 0;
const zod_1 = require("zod");
const signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required!',
        }),
        email: zod_1.z.string({
            required_error: 'Email is required!',
        }),
        password: zod_1.z
            .string({
            required_error: 'Password is required!',
        })
            .min(6)
            .max(15),
    }),
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required!',
        }),
        password: zod_1.z
            .string({
            required_error: 'Password is required!',
        })
            .min(6)
            .max(15),
    }),
});
exports.authSchemas = {
    signupSchema,
    loginSchema,
};
//# sourceMappingURL=auth.zodSchema.js.map