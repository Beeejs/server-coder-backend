import { z } from 'zod';

const unitAmountSchema = z.object({
  value: z.string({ message: 'Value must be a string.' }),
  currency_code: z.string({ message: 'Currency code must be a string.' })
});

const itemSchema = z.object({
  name: z.string({ message: 'Item name must be a string.' }),
  unit_amount: unitAmountSchema,
  quantity: z.string({ message: 'Quantity must be a string.' })
});

const amountSchema = z.object({
  value: z.string({ message: 'Amount value must be a string.' }),
  currency_code: z.string({ message: 'Amount currency code must be a string.' }),
  breakdown: z.object({
    item_total: unitAmountSchema
  })
});

const orderSchema = z.object({
  amount: amountSchema,
  items: z.array(itemSchema)
});

const paypalOrderValidation = z.object({
  service: z.string({ message: 'Service must be a string.' }),
  order: orderSchema
});

export { paypalOrderValidation };
