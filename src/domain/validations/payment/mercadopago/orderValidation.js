import { z } from 'zod';

const productSchema = z.object({
  title: z.string({ message: 'Title must be a string.' }),
  unit_price: z.number({ message: 'Unit price must be a number.' }).positive({ message: 'Phone number must be a positive.' }),
  currency_id: z.string({ message: 'Currency ID must be a string.' }),
  quantity: z.number({ message: 'Quantity must be a number.' }).positive({ message: 'Phone number must be a positive.' })
});

const phoneSchema = z.object({
  area_code: z.string({ message: 'Area code must be a string.' }),
  number: z.number({ message: 'Phone number must be a number.' }).positive({ message: 'Phone number must be a positive.' })
});

const identificationSchema = z.object({
  type: z.string({ message: 'Identification type must be a string.' }),
  number: z.string({ message: 'Identification number must be a string.' })
});

const addressSchema = z.object({
  street_name: z.string({ message: 'Street name must be a string.' }),
  street_number: z.number({ message: 'Street number must be a number.' }).positive({ message: 'Street number must be a positive.' }),
  zip_code: z.string({ message: 'ZIP code must be a string.' })
});

const payerSchema = z.object({
  name: z.string({ message: 'Name must be a string.' }),
  surname: z.string({ message: 'Surname must be a string.' }),
  email: z.string({ message: 'Email must be a valid email.' }).email({ message: 'Email must be a valid email.' }),
  phone: phoneSchema,
  identification: identificationSchema,
  address: addressSchema
});

const orderSchema = z.array(productSchema);

const mpOrderValidation = z.object({
  order: orderSchema,
  payer: payerSchema,
  service: z.string({ message: 'Service must be a string.' })
});

export { mpOrderValidation };
