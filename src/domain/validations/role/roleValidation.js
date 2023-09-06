import z from 'zod';

const roleCreateValidation = z.object({
  name: z.string({ message: 'Must be a string.' }).min(5, { message: 'Must be 4 or more characters long' }).max(6, { message: 'Must be 10 or least characters long' }).nonempty({ message: 'The field must not be empty' }),
  permissions: z.object({
    roles: z.array(z.string({ message: 'Must be a string.' })),
    products: z.array(z.string({ message: 'Must be a string.' })),
    users: z.array(z.string({ message: 'Must be a string.' })),
    sessions: z.array(z.string({ message: 'Must be a string.' })),
    carts: z.array(z.string({ message: 'Must be a string.' }))
  }),
  enable: z.boolean({ message: 'Must be true or false.' }).optional()
});

const roleUpdateValidation = z.object({
  name: z.string({ message: 'Must be a string.' }).min(5, { message: 'Must be 4 or more characters long' }).max(6, { message: 'Must be 10 or least characters long' }).nonempty({ message: 'The field must not be empty' }).optional(),
  permissions: z.object({
    roles: z.array(z.string({ message: 'Must be a string.' })).optional(),
    products: z.array(z.string({ message: 'Must be a string.' })).optional(),
    users: z.array(z.string({ message: 'Must be a string.' })).optional(),
    sessions: z.array(z.string({ message: 'Must be a string.' })).optional(),
    carts: z.array(z.string({ message: 'Must be a string.' })).optional()
  }),
  enable: z.boolean({ message: 'Must be true or false.' }).optional()
});

export { roleCreateValidation, roleUpdateValidation };
