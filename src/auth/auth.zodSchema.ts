import { z } from 'zod';

const signupSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required!',
    }),
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z
      .string({
        required_error: 'Password is required!',
      })
      .min(6)
      .max(15),
  }),
});
const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z
      .string({
        required_error: 'Password is required!',
      })
      .min(6)
      .max(15),
  }),
});

export const authSchemas = {
  signupSchema,
  loginSchema,
};
