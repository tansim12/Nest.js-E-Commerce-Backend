import { z } from 'zod';
export declare const authSchemas: {
    signupSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            password?: string;
            name?: string;
            email?: string;
        }, {
            password?: string;
            name?: string;
            email?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            password?: string;
            name?: string;
            email?: string;
        };
    }, {
        body?: {
            password?: string;
            name?: string;
            email?: string;
        };
    }>;
    loginSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            password?: string;
            email?: string;
        }, {
            password?: string;
            email?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body?: {
            password?: string;
            email?: string;
        };
    }, {
        body?: {
            password?: string;
            email?: string;
        };
    }>;
};
