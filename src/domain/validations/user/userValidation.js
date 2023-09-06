import z from 'zod';

const userUpdateValidation = z.object({
  firstName: z.string({ message: 'First name must be a string.' }).min(3, { message: 'First name must be 3 or more characters long' }).max(10, { message: 'First name must be 10 or least characters long' }).nonempty({ message: 'The field must not be empty' }).optional(),
  lastName: z.string({ message: 'Last name must be a string.' }).min(3, { message: 'Last name must be 3 or more characters long' }).max(10, { message: 'Last name must be 10 or least characters long' }).nonempty({ message: 'The field must not be empty' }).optional(),
  age: z.number({ message: 'Age must be a number.' }).positive().optional(),
  email: z.string().email({ message: 'Email must be a email.' }).nonempty({ message: 'The field must not be empty' }).optional(),
  password: z.string().nonempty({ message: 'Password must not be empty' }).min(8, { message: 'Password must be 8 or more characters long' }).refine(value =>
{
 return /[a-zA-Z]/.test(value) && /\d/.test(value);
}, { message: 'The password must contain letters and numbers' }).optional(),
  role: z.string({ message: 'Role must be a string.' }).nonempty({ message: 'Role must not be empty' }).refine(value => value === 'client' || value === 'admin', { message: 'The role value is invalid.' }).optional(),
  enable: z.boolean({ message: 'Enable must be true or false.' }).optional()
});

const userIsActive = z.object({
  enable: z.literal(true,
    {
      errorMap: () => ({ message: 'Your account has been inactive.' })
    }
  )
});

export { userUpdateValidation, userIsActive };
