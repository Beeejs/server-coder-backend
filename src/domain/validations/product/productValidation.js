import z from 'zod';

const productCreateValidator = z.object({
  title : z.string({ message: 'Title must be a string.' }).nonempty({ message: 'Title must not be empty' }).min(4, { message: 'Title must be 4 or more characters long' }),
  description : z.string({ message: 'Description must be a string.' }).nonempty({ message: 'Description must not be empty' }).min(4, { message: 'Description must be 4 or more characters long' }),
  price: z.number({ message: 'Price must be a number.' }).positive({ message: 'The price number must be a positive' }),
  code: z.string({ message: 'Code must be a string.' }).nonempty({ message: 'Code must not be empty' }).or(z.number({ message: 'Code must be a number.' })),
  stock: z.number({ message: 'Stock must be a number.' }).positive({ message: 'The stock number must be a positive' }),
  category: z.string({ message: 'Category must be a string.' }).nonempty({ message: 'Category must not be empty' }),
  enable: z.boolean({ message: 'Enable must be true or false.' }).optional()
});

const productUpdateValidator = z.object({
  title : z.string({ message: 'Title must be a string.' }).nonempty({ message: 'Title must not be empty' }).min(4, { message: 'Title must be 4 or more characters long' }).optional(),
  description : z.string({ message: 'Description must be a string.' }).nonempty({ message: 'Description must not be empty' }).min(4, { message: 'Description must be 4 or more characters long' }).optional(),
  price: z.number({ message: 'Price must be a number.' }).positive({ message: 'The price number must be a positive' }).optional(),
  code: z.string({ message: 'Code must be a string.' }).nonempty({ message: 'Code must not be empty' }).or(z.number({ message: 'Code must be a number.' })).optional(),
  stock: z.number({ message: 'Stock must be a number.' }).positive({ message: 'The stock number must be a positive' }).optional(),
  category: z.string({ message: 'Category must be a string.' }).nonempty({ message: 'Category must not be empty' }).optional(),
  enable: z.boolean({ message: 'Enable must be true or false.' }).optional()
});


export { productCreateValidator, productUpdateValidator };
