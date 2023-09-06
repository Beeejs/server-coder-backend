import z from 'zod';

const addressSchema = z.object({
  street_name: z.string().optional(),
  street_number: z.string().optional(),
  zip_code: z.string().optional()
});

const identificationSchema = z.object({
  number: z.string().optional(),
  type: z.string().optional()
});

const phoneSchema = z.object({
  area_code: z.string().optional(),
  number: z.string().optional()
});

const payerSchema = z.object({
  address: addressSchema,
  first_name: z.string(),
  last_name: z.string(),
  identification: identificationSchema.optional(),
  phone: phoneSchema.optional(),
  email: z.string()
});

const productSchema = z.object({
  name: z.string(),
  quantity: z.number().int(),
  price: z.number()
});

const informationSchema = z.object({
  payer: payerSchema,
  payment_id: z.string(),
  products: z.array(productSchema),
  mount: z.number(),
  method: z.string().optional(),
  card: z.string().optional(),
  state_transaction: z.string().optional(),
  installments: z.number().optional()
});

const ticketCreateValidation = z.object({
  code: z.string(),
  purchase_datetime: z.date().or(z.string()),
  information: informationSchema,
  enable: z.boolean().default(true)
});

export { ticketCreateValidation };
